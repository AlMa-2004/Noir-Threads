window.onload = function () {
    btn = document.getElementById("filtrare");
    btn.onclick = function () {
        let inpNume = document.getElementById("inp-nume").value.trim().toLowerCase();

        let doarMembri = document.getElementById("chk-membru").checked;

        let radioCulori = document.getElementsByName("rad-culoare");
        let culoareSelectata = "toate";
        for (let rad of radioCulori) {
            if (rad.checked) {
                culoareSelectata = rad.value.trim().toLowerCase();
                break;
            }
        }

        let produse = document.getElementsByClassName("produs");

        for (let prod of produse) {
            prod.style.display = "none";

            let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            let cond1 = nume.includes(inpNume);

            let membri = prod.getElementsByClassName("val-membru")[0].innerHTML.trim().toLowerCase();
            let cond2 = !doarMembri || membri === "da";

            let culoare = prod.getElementsByClassName("val-culoare")[0].innerHTML.trim().toLowerCase();
            let cond3 = (culoareSelectata === "toate" || culoare === culoareSelectata);

            if (cond1 && cond2 && cond3) {
                prod.style.display = "block";
            }
        }
    };

    document.getElementById("resetare").onclick = function () {
        document.getElementById("inp-nume").value = "";
        document.getElementById("chk-membru").checked = false;

        let radioCulori = document.getElementsByName("rad-culoare");
        for (let rad of radioCulori) {
            if (rad.value === "toate") {
                rad.checked = true;
                break;
            }
        }

        let produse = document.getElementsByClassName("produs");
        for (let prod of produse) {
            prod.style.display = "block";
        }
    };

    document.getElementById("sortCrescNume").onclick = function () {
        sorteaza(1);
    };
    document.getElementById("sortDescrescNume").onclick = function () {
        sorteaza(-1);
    };

    function sorteaza(semn){
        let produse= document.getElementsByClassName("produs");
        let vProduse= Array.from(produse);
        vProduse.sort(function(a,b){
            let pretA=parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML.trim())
            let pretB=parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML.trim())
            if (pretA!=pretB){
                return semn*(pretA-pretB)
            }
            let numeA=a.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
            let numeB=b.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
            return semn*numeA.localeCompare(numeB)
        })
        for (let prod of vProduse){
            prod.parentNode.appendChild(prod);
        }

    }
}