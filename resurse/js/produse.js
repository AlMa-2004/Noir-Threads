window.onload = function () {
    
    function filtrare() {
        // NFD = normalization from decomposition => toate caracterele cu diacritice sunt descompuse in alfabetul englezesc si simbolul sau distinct separat (ș => s,)
        // range-ul este fix pentru aceste semne diacritice, pe care le scoate din interpretarea numelui introdus cu regexul
        let inpNume = document.getElementById("inp-nume").value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        //validare input nume
        let potriviri = inpNume.match(/[^a-zA-ZăâîșțĂÂÎȘȚ\s\*]/g);
        if (potriviri) {
            alert("Numele produsului conține caractere interzise: " + potriviri.join(" "));
            document.getElementById("resetare").click(); 
            return;
        }

         //user-ul nu se foloseste de autocomplete si: 
        // (2 cazuri marginale) scrie ceva care s-ar putea potrivi cu una din firme, sau ce a scris nu exista deloc => warning date invalide
        let inpFirma = document.getElementById("inp-firma").value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
        if (inpFirma === "") inpFirma = "toate";

        //validare input datalist
        if (inpFirma !== "toate") {
            let potriviri = inpFirma.match(/[^a-zA-ZăâîșțĂÂÎȘȚ\s\*]/g); 
            if (potriviri) {
                alert("Numele firmei conține caractere interzise: " + potriviri.join(" "));
                document.getElementById("resetare").click(); 
                return;
            }
            //selectez toti "copiii" de tip option ai datalist-ului (dat prin id), transform intr-un
            //vector propriu-zis (initial NodeList), mapez optiunile formalizate direct in vector
            let optiuniFirma = Array.from(document.querySelectorAll("#lista-firme option")).map(opt => opt.value.trim().toLowerCase());
            let ok = optiuniFirma.includes(inpFirma);
            if (!ok) {
                alert("Firma nu exista!");
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

        let inpTrupa = document.getElementById("inp-trupa").value.trim().toLowerCase();
        
        let materialeSelectate = Array.from(document.getElementById("inp-materiale").selectedOptions).map(opt => opt.value.trim().toLowerCase());

        let inpDescriere = document.getElementById("inp-descriere").value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        let textarea = document.getElementById("inp-descriere");
        if (inpDescriere.length > 0 && inpDescriere.length < 3) {
            textarea.classList.add("is-invalid");
            return;
        }

        let inpMin = document.getElementById("inp-pret-min");
        let inpMax = document.getElementById("inp-pret-max");

        let produse = document.getElementsByClassName("produs");

        let existaProduse = false;

        for (let prod of produse) {
            prod.style.display = "none";

            let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            let cond1 = nume.includes(inpNume)

            if (inpNume.includes("*")) {
                let [inceput, final] = inpNume.split("*");
                //console.log(inceput, final);
                let regex2 = new RegExp(`\\b${inceput}.*${final}\\b`, "i");

                cond1 = regex2.test(nume);
            }
            //console.log(cond1)

            let membri = prod.getElementsByClassName("val-membru")[0].innerHTML.trim().toLowerCase();
            let cond2 = (!doarMembri || membri === "da");

            let culoare = prod.getElementsByClassName("val-culoare")[0].innerHTML.trim().toLowerCase();
            let cond3 = (culoareSelectata === "toate" || culoare === culoareSelectata);

            let firma = prod.getElementsByClassName("val-firma")[0].innerHTML.trim().toLowerCase();
            let cond4 = inpFirma == "toate" || firma == inpFirma;
            
            let trupa = prod.getElementsByClassName("val-trupa")[0].innerHTML.trim().toLowerCase();
            let cond5 = inpTrupa === "toate" || trupa === inpTrupa;

            let materialeProdus = prod.querySelector(".val-materiale").innerText.split(",").map(m => m.trim().toLowerCase());
            let cond6 = materialeSelectate.length === 0 || materialeSelectate.every(mat => materialeProdus.includes(mat));

            let descriere = prod.getElementsByClassName("val-descriere")[0].innerHTML.trim().toLowerCase();
            let cond7 = inpDescriere === "" || inpDescriere.split(/\s+/).every(cuv => descriere.includes(cuv));

            let pretMin = parseFloat(inpMin.value);
            let pretMax = parseFloat(inpMax.value);

            if (pretMin > pretMax) {
                alert("Prețul minim nu poate fi mai mare decât prețul maxim!");
                document.getElementById("resetare").click();
                return;
            }

            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim());
            let cond8 = pret >= pretMin && pret <= pretMax;

            if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8) {
                prod.style.display = "block";
                existaProduse = true;
            }
        }

        if (existaProduse) {
            document.getElementById("nuexista").style.display = "none";
        } 
        else {
            document.getElementById("nuexista").style.display = "block";
        }

        // filtreaza toate elementele .produs si le lasa doar pe cele care sunt afisate
        let produseVizibile = Array.from(document.getElementsByClassName("produs")).filter(p => p.style.display == "block");
        document.getElementById("numar-produse").textContent = produseVizibile.length;
    };

    document.getElementById("inp-nume").oninput = filtrare;
    document.getElementById("inp-firma").onchange = filtrare;
    document.getElementById("inp-trupa").onchange = filtrare;
    document.getElementById("chk-membru").onchange = filtrare;
    document.getElementById("inp-materiale").onchange = filtrare;
    document.getElementById("inp-pret-min").onchange = filtrare;
    document.getElementById("inp-pret-max").onchange = filtrare;

    let radioCulori = document.getElementsByName("rad-culoare");
    for (let rad of radioCulori) {
        rad.onchange = filtrare;
    }

    // mai aveam deja un check on input deci este necesar sa reunesc cele 2 functii (cautarea cu descriere era invalid la <3 chars)

    document.getElementById("inp-descriere").oninput = function () {
    let val = this.value.trim();
        if (val.length >= 3 || val.length === 0) {
            this.classList.remove("is-invalid");
        } else {
            this.classList.add("is-invalid");
        }

        filtrare();
    };

    // analog pentru slidere
    document.getElementById("inp-pret-min").oninput = function () {
        document.getElementById("info-pret-min").innerHTML = `(${document.getElementById("inp-pret-min").value})`;
       filtrare();
    };

    document.getElementById("inp-pret-max").oninput = function () {
        document.getElementById("info-pret-max").innerHTML = `(${document.getElementById("inp-pret-max").value})`;
        filtrare();
    };


    document.getElementById("resetare").onclick = function () {
        if (!confirm("Doresti sa resetezi toate filtrele?")) {
        return;
    }
        document.getElementById("nuexista").style.display = "none"; 

        document.getElementById("inp-nume").value = "";
        document.getElementById("chk-membru").checked = false;

        let radioCulori = document.getElementsByName("rad-culoare");
        for (let rad of radioCulori) {
            if (rad.value === "toate") {
                rad.checked = true;
                break;
            }
        }

        document.getElementById("inp-firma").value="toate";
        document.getElementById("inp-trupa").value="toate";
        
        let matSelect = document.getElementById("inp-materiale");
        for (let opt of matSelect.options) {
            opt.selected = false;
        }

        document.getElementById("inp-descriere").value = "";

        document.getElementById("inp-pret-min").value = document.getElementById("inp-pret-min").min;
        document.getElementById("info-pret-min").innerHTML = `(${document.getElementById("inp-pret-min").min})`;

        document.getElementById("inp-pret-max").value = document.getElementById("inp-pret-max").max;
        document.getElementById("info-pret-max").innerHTML = `(${document.getElementById("inp-pret-max").max})`;

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

    window.onkeydown=function(e){
        console.log(e)
        if (e.key=="c" && e.altKey){
            let produse= document.getElementsByClassName("produs")
            sumaPreturi=0
            for (let prod of produse){
                if(prod.querySelector(".select-cos").checked){
                    let pret=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim())
                    sumaPreturi+=pret
                }
            }
            if(!document.getElementById("suma_preturi")){
                let pRezultat=document.createElement("p") //<p></p>
                pRezultat.innerHTML=sumaPreturi //<p>sumaPreturi</p>
                pRezultat.id="suma_preturi"
                let p = document.getElementById("p-suma")
                p.parentNode.insertBefore(pRezultat, p.nextElementSibling)
                setTimeout(function(){
                    let p1=document.getElementById("suma_preturi")
                    if(p1){
                        p1.remove()
                    }
                }, 2000)
            }
        }
    }

}