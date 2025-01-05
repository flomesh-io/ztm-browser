import Button from 'primevue/button';
import ToggleSwitch from 'primevue/toggleswitch';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';

export function useComponent(app){
	
	app.component('Button', Button);
	app.component('ToggleSwitch', ToggleSwitch);
	app.component('Select', Select);
	app.component('InputText', InputText);
}
