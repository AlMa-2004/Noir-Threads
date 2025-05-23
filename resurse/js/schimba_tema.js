window.addEventListener("DOMContentLoaded", function(){
    document.getElementById("schimba_tema").onclick=function(){
        if (document.body.classList.toggle("light")){
            localStorage.setItem("tema","light")
        }
        else{
            localStorage.removeItem("tema")
        }
    }
})