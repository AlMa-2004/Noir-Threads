window.onload = function () {
    btn = document.getElementById("filtrare");
    btn.onclick = function () {
        let inpNume = document.getElementById("inp-nume").value.trim().toLowerCase();

        //validare input nume
        let potriviri = inpNume.match(/[^a-zA-Z]/g);
        if (potriviri) {
            alert("Numele produsului conține caractere interzise: " + potriviri.join(" "));
            document.getElementById("resetare").click(); 
            return;
        }

         //user-ul nu se foloseste de autocomplete si: 
        // (2 cazuri marginale) scrie ceva care s-ar putea potrivi cu una din categorii, sau ce a scris nu exista deloc => warning date invalide
        let inpCategorie = document.getElementById("inp-categorie").value.trim().toLowerCase();

        //validare input datalist
        potriviri = inpCategorie.match(/[^a-zA-Z]/g); 
        if (potriviri) {
            alert("Numele categoriei conține caractere interzise: " + potriviri.join(" "));
            document.getElementById("resetare").click(); 
            return;
        } //daca nu am caractere interzise, trece la verificarea numelor de categorie
        else{
            //selectez toti "copiii" de tip option ai datalist-ului (dat prin id), transform intr-un
            //vector propriu-zis (initial NodeList), mapez optiunile formalizate direct in vector 
            let optiuniCategorie = Array.from(document.querySelectorAll("#lista-categorii option")).map(opt => opt.value.trim().toLowerCase());
            let ok = 0;
            for(let opt of optiuniCategorie){
                if(opt.includes(inpCategorie))
                {
                    inpCategorie = opt
                    ok = 1
                    break
                }
                    
            }
            if(!ok){
                alert("Categoria nu exista!");
                document.getElementById("resetare").click(); 
                return;
            }
        }

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

            let categorie = prod.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();
            let cond4 = categorie == inpCategorie
            
            if (cond1 && cond2 && cond3 && cond4) {
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

        document.getElementById("inp-categorie").value="";
        
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
        let produse = document.getElementsByClassName("produs");
        let vProduse = Array.from(produse);
        
        vProduse.sort(function(a, b){
            let numeA = a.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            let numeB = b.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();

            let cmpNume = semn * numeA.localeCompare(numeB);
            if (cmpNume !== 0) return cmpNume;

            let descA = (a.getElementsByClassName("val-descriere")[0].innerHTML.trim()).length;
            let descB = (b.getElementsByClassName("val-descriere")[0].innerHTML.trim()).length;

            return semn * (descA - descB);
        });

        for (let prod of vProduse){
            prod.parentNode.appendChild(prod);
        }
    }

}