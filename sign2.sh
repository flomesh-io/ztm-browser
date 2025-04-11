#!/bin/bash

# 参数说明：
# $1: APP路径 (如 dist/YourApp.app)
# $2: Apple ID (用于公证)
# $3: Team ID (在Apple Developer后台查看)

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
  echo "用法: $0 <APP路径> <Apple ID> <Team ID>"
  exit 1
fi

APP_PATH="$1"
APP_NAME=$(basename "$APP_PATH" .app)
APP_DIR=$(dirname "$APP_PATH")
DEVELOPER_ID_APP="Developer ID Application: Flomesh Limited ($3)"
DEVELOPER_ID_INSTALLER="Developer ID Application: Flomesh Limited ($3)"
APPLE_ID="$2"
TEAM_ID="$3"
BUNDLE_ID="com.flomesh.ztm.browser"

# 创建临时目录
TMP_DIR=$(mktemp -d)
ENTITLEMENTS="$TMP_DIR/entitlements.plist"

# 1. 生成entitlements文件
cat > "$ENTITLEMENTS" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.debugger</key>
    <true/>
  </dict>
</plist>
EOF

# 2. 签名应用
echo "正在签名应用程序..."
codesign --deep --force --verbose --sign "$DEVELOPER_ID_APP" --options runtime --entitlements "$ENTITLEMENTS" "$APP_PATH"

# 验证签名
echo "验证签名..."
codesign -dv --verbose=4 "$APP_PATH" || exit 1
spctl -a -vv "$APP_PATH" || exit 1

# 3. 打包为zip（公证需要）
ZIP_PATH="$TMP_DIR/$APP_NAME.zip"
echo "创建ZIP包用于公证..."
ditto -c -k --keepParent "$APP_PATH" "$ZIP_PATH"

# 4. 提交公证
echo "提交公证..."
NOTARIZE_RESULT=$(xcrun notarytool submit "$ZIP_PATH" --apple-id "$APPLE_ID" --team-id "$TEAM_ID" --wait --timeout 10m 2>&1)
REQUEST_ID=$(echo "$NOTARIZE_RESULT" | grep -o "id: [a-zA-Z0-9-]*" | cut -d' ' -f2)

if [ -z "$REQUEST_ID" ]; then
  echo "公证提交失败:"
  echo "$NOTARIZE_RESULT"
  exit 1
fi

echo "公证成功，Request ID: $REQUEST_ID"

# 5. 附加公证结果
echo "附加公证票据..."
xcrun stapler staple "$APP_PATH"

# 6. 打包DMG（可选）
DMG_PATH="$APP_DIR/$APP_NAME.dmg"
echo "创建DMG..."
hdiutil create -volname "$APP_NAME" -srcfolder "$APP_PATH" -ov -format UDZO "$DMG_PATH"

# 签名DMG
echo "签名DMG..."
codesign --sign "$DEVELOPER_ID_APP" "$DMG_PATH"

# 7. 清理临时文件
rm -rf "$TMP_DIR"

echo "全部完成！"
echo "已签名的应用: $APP_PATH"
echo "已签名的DMG: $DMG_PATH"