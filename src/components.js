import Button from 'primevue/button';
import ToggleSwitch from 'primevue/toggleswitch';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

export function useComponent(app){
	
	app.component('Button', Button);
	app.component('ToggleSwitch', ToggleSwitch);
	app.component('Select', Select);
	app.component('InputText', InputText);
	app.component('ConfirmDialog', ConfirmDialog);
	app.component('Toast', Toast);
}
