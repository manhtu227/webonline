const submit = document.querySelector(".btn-success")
const input = document.querySelectorAll(".form-control")
const required = document.querySelectorAll(".required")
const nameformat = /^[A-Za-z][A-Za-z0-9_]{7,29}$/;
const mailformat =
  /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;
submit.addEventListener("click",function(e){
    if (input[0].value.length === 0) {
        required[0].innerHTML = "<i class='fas fa-exclamation-circle required-icon' style='color:red'></i> Please fill name";
        input[0].focus();
        e.preventDefault();
    }
    if (input[1].value.length === 0) {
        required[1].innerHTML = "Please fill email";
        input[1].focus();
        e.preventDefault();
    }
    if (!input[1].value.match(mailformat)) {
        required[1].innerHTML = "<i class='fas fa-exclamation-circle required-icon' style='color:red'></i> Please match the requested format.";
        input[1].focus();
        e.preventDefault();
    }

})
input[0].oninput = (e) => {
    required[0].innerHTML=""
    
}
input[0].onblur = (e) => {
    console.log(input[0].value.length)
    if (input[0].value.length === 0 ) {
        required[0].innerHTML = "<i class='fas fa-exclamation-circle required-icon' style='color:red'></i> Please fill name";
        input[0].focus();
    }
}
input[1].oninput = (e) => {
    required[1].innerHTML=""
}
input[1].onblur = (e) => {
    console.log(input[1].value.length)
    if (input[1].value.length === 0) {
    required[1].innerHTML = "<i class='fas fa-exclamation-circle required-icon' style='color:red'></i> Please fill email";
    input[1].focus();
    }
}
