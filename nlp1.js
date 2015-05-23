
function NLForm(el){
this.el = el;
this.field_open = -1;
this.fields = new Array();
this.overlay = document.querySelector('.collegeink_search_overlay');
this.selects = this.el.querySelectorAll('select');
this.inputs = this.el.querySelectorAll('input');
this.all = this.el.querySelectorAll('select, input');
this.body = document.querySelector('body');
this.list_fields = new Array();
this.init();
}

NLForm.prototype = {

init : function(){
var self = this;

Array.prototype.slice.call(this.selects).forEach(function(el,i){
self.list_fields.push(new NLField(self,el,'select',2));
});

Array.prototype.slice.call(this.inputs).forEach(function(el,i){
self.list_fields.push(new NLField(self,el,'input',2));
});


this.overlay.addEventListener('click',function(){
self.close_fields();
});

},

close_fields : function(){
var self = this;
this.overlay.style.visibility = 'hidden';
this.overlay.style.opacity = 0;
this.list_fields.forEach(function(el,i){
el.close();
});
}

}



function NLField(form,el,type,idx){
this.form = form;
this.original = el;
this.type = type;
this.idx = idx;
this.selectedIdx = 0;
this.open = false;
this.init();
this.init_events();
}


NLField.prototype = {

init : function(){
if(this.type == 'select'){
this.create_dropdown();
}
else if(this.type == 'input'){
this.create_inputfield();
}
},

create_dropdown : function(){
var self = this;
var select_id = this.original.getAttribute('id');
this.div_wrapper = document.createElement('div');
this.div_wrapper.setAttribute('id',select_id);
this.div_wrapper.className = 'dropdown_wrapper nlp_field';
this.toggle = document.createElement('a');
this.toggle.className = 'toggle_field';
this.toggle.setAttribute('data-list-id',select_id);
this.toggle.innerHTML = this.original.options[this.original.selectedIndex].innerHTML;
this.selectedIdx = this.original.selectedIndex;
this.option_list = document.createElement('ul');
this.options = this.original.querySelectorAll('option');
Array.prototype.slice.call(this.options).forEach(function(el,i){
var a = document.createElement('li');
var special = el.getAttribute('data-special');
a.className = 'field_list_item';
a.innerHTML = self.options[i].innerHTML;
self.option_list.appendChild(a);
if(typeof(special) != undefined){
self.create_special(el);
}
});
this.option_elements = this.option_list.querySelectorAll('li');
this.option_elements[this.selectedIdx].className += ' field_checked';
this.div_wrapper.appendChild(this.option_list);
this.original.parentNode.insertBefore(this.toggle,this.original);
this.original.style.visibility = 'hidden';
this.form.body.appendChild(this.div_wrapper);
//this.form.list_fields.push({'id' : select_id});
},

create_inputfield : function(){
var self = this;
var select_id = this.original.getAttribute('id');
this.div_wrapper = document.createElement('div');
this.div_wrapper.setAttribute('id',select_id);
this.div_wrapper.className = 'input_wrapper nlp_field input_field';
this.toggle = document.createElement('a');
this.toggle.setAttribute('data-list-id',select_id);
this.toggle.className = 'toggle_field';
this.toggle.innerHTML = this.original.value;
this.selectedIdx = this.original.selectedIndex;
this.option_list = document.createElement('ul');
this.input_wrapper = document.createElement('li');
this.input_wrapper.className = 'field_list_item';
this.input_el = document.createElement('input');
this.input_el.setAttribute('type','text');
this.input_el.setAttribute('placeholder',this.original.getAttribute('placeholder'));
this.input_el.className = 'field_list_input_item input_field';
this.submit = document.createElement('button');
this.submit.className = 'input_submit_button';
this.submit.innerHTML = 'Find';
this.example_wrapper = document.createElement('li');
this.input_wrapper.className = 'field_list_item input_example';
this.example_wrapper.innerHTML = this.original.getAttribute('data-example');
this.example_wrapper.className = 'field_list_input_item field_list_item input_field_example';
this.input_wrapper.appendChild(this.input_el);
this.input_wrapper.appendChild(this.submit);
this.option_list.appendChild(this.input_wrapper);
this.option_list.appendChild(this.example_wrapper);
this.div_wrapper.appendChild(this.option_list);
this.original.parentNode.appendChild(this.toggle,this.original);
this.form.body.appendChild(this.div_wrapper);
//this.form.list_fields.push({'id' : select_id});
//console.log(document.getElementById(select_id).className);
},

open_field : function(id){
var self = this;
if(this.form.field_open == -1){
this.form.overlay.style.visibility = 'visible';
this.form.overlay.style.opacity = 1;
this.div_wrapper.className += ' field_open';
this.open = true;
}
else{
this.close();
}
},

close : function(type,opts){
var self = this;
if(type == 'dropdown'){
if(opts){
var opts1 = (typeof(opts) == 'undefined') ? 'none' : opts;
if(opts1 != 'none'){
this.option_list.children[this.selectedIdx].className = this.option_list.children[this.selectedIdx].className.replace("field_checked","");
this.selectedIdx = opts;
var sel1 = this.option_list.children[this.selectedIdx];
sel1.className += ' field_checked';
this.toggle.innerHTML = this.option_list.children[this.selectedIdx].innerHTML;
}
}
}else if(type == 'input'){
var text = self.option_list.querySelector('.field_list_input_item').value;
self.toggle.innerHTML = text;
}
this.div_wrapper.className = this.div_wrapper.className.replace("field_open","");
this.form.overlay.style.visibility = 'hidden';
this.form.overlay.style.opacity = 0;
},

init_events : function(){
var self = this;
this.toggle.addEventListener('click',function(){
var attr = this.getAttribute('data-list-id');
self.open_field(attr);
});

if(this.type == 'select'){
var opts = Array.prototype.slice.call(this.option_list.querySelectorAll('li'));
opts.forEach(function(el,i){
if(el.getAttribute('data-special')){
el.addEventListener('click',function(){
self.close('dropdown',opts.indexOf(el));
});
}
});
}

if(this.type == 'input'){
var self = this;
this.option_list.querySelector('.input_submit_button').addEventListener('click',function(){
self.close('input');
});
}



},


create_special : function(el){
var self = this;

if(el.getAttribute('data-special') == 'input'){
var special_el = document.createElement('input');
special_el.setAttribute('type','text');
special_el.setAttribute('placeholder',el.getAttribute('data-special-value'));
var special_name = el.getAttribute('data-special-name');
special_el.setAttribute('id',special_name);
special_el.setAttribute('class',special_name);
self.option_list.appendChild(special_el);
}
console.log(self.option_list);
el.addEventListener('click',function(){
self.option_list.className += ' hide_list';
var special_el = this.querySelector('.'+el.getAttribute('data-special-name'));
special_el.className = special_el.className.replace("hide_list",""); 
special_el.className += ' show_list';
});

}

}
