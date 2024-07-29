function Validator(options){
    var selectorRules = {};
    function validate(inputElement, rule){
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage ;
        //Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];
        // Lặp qua từng rules & kiểm tra
        // Nếu có lỗi thì dừng lại kiểm tra
        for(var i=0; i<rules.length; i++){
            errorMessage = rules[i](inputElement.value);
         if(errorMessage) break;
      }
       if(errorMessage){
             errorElement.innerText =errorMessage;
            inputElement.parentElement.classList.add('invalid');
         }else{
        errorElement.innerText='';
        inputElement.parentElement.classList.remove('invalid');
    }
    return !errorMessage;
}
  var formElement = document.querySelector(options.form);
  if(formElement){
    formElement.onsubmit = function(e){
     e.preventDefault();
     var isFormValid = true;
    //  Lặp qua từng rules và validate
    options.rules.forEach(function(rule){
        var inputElement = formElement.querySelector(rule.selector);
        var isValid=  validate(inputElement, rule);
        if(!isValid){
            isFormValid = false;
        }
    });
       if(isFormValid){
        // Trường hợp submit với javascript 
         if(typeof options.onSubmit==="function"){
            var enableInputs= formElement.querySelector('[name]:not([disabled])');
            var formValues =Array.from(enableInputs).reduce(function(values, input){
                return (values[input.name] = input.value) && values;
            }, {});
            options.onSubmit(formValues)
         }
        //  Trường hơp submit với hành vi mặc định
         else{
            formElement.submit();s
         }
       }
    }
    options.rules.forEach(function(rule){
        //Lưu lại các rule cho mỗi input
        if(Array.isArray(selectorRules[rule.selector])){
            selectorRules[rule.selector].push(rule.test)
        }else{
           selectorRules[rule.selector] = [rule.test];
         }
        var inputElement = formElement.querySelector(rule.selector);
        if(inputElement){
            inputElement.onblur = function(){
              validate(inputElement, rule);
            }
            inputElement.oninput = function(){
                var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                errorElement.innerText='';
                inputElement.parentElement.classList.remove('invalid');
            }
        }
    })
  }
  
}
Validator.isRequired =function(selector, message ){
    return {
        selector:selector,
        test: function(value){
           return value.trim() ? undefined: message || 'Vui lòng nhập trường này'
        }
    }
}
Validator.isEmail =function(selector , message ){
    return {
        selector:selector,
        test: function(value){
            var regex =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value)? undefined:message || 'Vui lòng nhập email'
        }
    }
}
Validator.minLength =function(selector, min ,message ){
    return {
        selector:selector,
        test: function(value){
            return value.length >= min ? undefined: message || `Vui lòng nhập vào tối thiểu ${min}`
        }
    }
}
Validator.isConfirmed = function(selector, getConfirmValue, message){
      return{
        selector:selector,
        test:function(value){
            return value === getConfirmValue() ? undefined : message || 'Dữ liệu nhập vào không chính xác'
        }
      }
}
