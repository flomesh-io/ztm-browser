import toast from "@/utils/toast";
//toast.add({ severity: 'contrast', summary: 'Tips', detail: "Deleted", life: 3000 });


const send = async (title, body) => {
	toast.add({ severity: 'contrast', summary: title, detail: body, life: 3000 });
}
export {
	send
};