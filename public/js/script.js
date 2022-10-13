function getCat(){
    if(document.getElementsByClassName('cat').length == 0)
    {
        const xhttp = new XMLHttpRequest();
        
        xhttp.open('GET', 'http://localhost:5000/api/cat', true);
        xhttp.send();
        
        xhttp.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200) {
                const listCat = JSON.parse(this.response).response;
                listCat.forEach(e => {
                    cat = `<div class="cat" onclick="catSelected(this)" value="${e.l}">${e.c}</div>`
                    document.getElementById("filtri").innerHTML += cat;
                });
            }
        }
    } else document.getElementById("filtri").innerHTML = '';
}

function catSelected(e){
    if(e.classList == 'cat') e.classList = ['catSel'];
    else e.classList = ['cat'];
}

function getDoc(){
    const xhttp = new XMLHttpRequest();
    
    if(document.getElementById("inSrch").value == "" && document.getElementsByClassName("catSel").length == 0){
        xhttp.open('GET', 'http://localhost:5000/api/doc/', true);
        xhttp.send();
        
        document.getElementById("doc").innerHTML = "";
    
        xhttp.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200) {
                const listDoc = JSON.parse(this.response).result;
                listDoc.forEach(e => {
                    doc = `<div class="doc" onclick="infoDoc('${e.link}')">`+
                            `<div>${e.cat} - ${e.posted} </div> ` +
                            `<div>${e.dataIn} - ${e.dataFin} </div>` + 
                            `<div>${e.descr}</div>` +
                          `</div>`;
                    document.getElementById("doc").innerHTML += doc;
                });
            }
        }
    }
    else if(document.getElementById("inSrch").value != "" && document.getElementsByClassName("catSel").length == 0){
        xhttp.open('GET', 'http://localhost:5000/api/doc/', true);
        xhttp.send();
        
        document.getElementById("doc").innerHTML = "";
    
        xhttp.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200) {
                const listDoc = JSON.parse(this.response).result;
                const docFiltr = [];
                const srch = document.getElementById("inSrch").value.split(" ");
                
                for(i = 0; i < listDoc.length; i++){
                    for(j = 0; j < srch.length; j++){
                        if(listDoc[i].descr.toLowerCase().includes(srch[j].toLowerCase())){
                            docFiltr.push(listDoc[i]);
                            break;
                        }
                    }
                }

                docFiltr.forEach(e => {
                    doc = `<div class="doc" onclick="infoDoc('${e.link}')">`+
                            `<div>${e.cat} - ${e.posted} </div> ` +
                            `<div>${e.dataIn} - ${e.dataFin} </div>` + 
                            `<div>${e.descr}</div>` +
                          `</div>`;
                    document.getElementById("doc").innerHTML += doc;
                });
            }
        }
    }
    else if(document.getElementById("inSrch").value == "" && document.getElementsByClassName("catSel").length > 0){
        const listCat = document.getElementsByClassName("catSel");
        
        document.getElementById("doc").innerHTML = "";
        
        for(i = 0; i < listCat.length; i++){
            const xhttp = new XMLHttpRequest();
            xhttp.open('GET', `http://localhost:5000/api/doc/${listCat[i].attributes[2].textContent.split("/")[3]}`, true);
            xhttp.send();
        
            xhttp.onreadystatechange = function(){
                if(this.readyState === 4 && this.status === 200) {
                    const listDoc = JSON.parse(this.response).result;
                    console.log(listDoc)
                    listDoc.forEach(e => {
                        doc = `<div class="doc" onclick="infoDoc('${e.link}')">`+
                                `<div>${e.cat} - ${e.posted} </div> ` +
                                `<div>${e.dataIn} - ${e.dataFin} </div>` + 
                                `<div>${e.descr}</div>` +
                              `</div>`;
                        document.getElementById("doc").innerHTML += doc;
                    });
                }
            }
        }        
    }
    else if(document.getElementById("inSrch").value != "" && document.getElementsByClassName("catSel").length > 0){
        const listCat = document.getElementsByClassName("catSel");
        
        document.getElementById("doc").innerHTML = "";
        
        for(i = 0; i < listCat.length; i++){
            const xhttp = new XMLHttpRequest();
            xhttp.open('GET', `http://localhost:5000/api/doc/${listCat[i].attributes[2].textContent.split("/")[3]}`, true);
            xhttp.send();

            xhttp.onreadystatechange = function(){
                if(this.readyState === 4 && this.status === 200) {
                    const listDoc = JSON.parse(this.response).result;
                    const docFiltr = [];
                    const srch = document.getElementById("inSrch").value.split(" ");

                    for(i = 0; i < listDoc.length; i++){
                        for(j = 0; j < srch.length; j++){
                            if(listDoc[i].descr.toLowerCase().includes(srch[j].toLowerCase())){
                                docFiltr.push(listDoc[i]);
                                break;
                            }
                        }
                    }

                    docFiltr.forEach(e => {
                        doc = `<div class="doc" onclick="infoDoc('${e.link}')">`+
                                `<div>${e.cat} - ${e.posted} </div> ` +
                                `<div>${e.dataIn} - ${e.dataFin} </div>` + 
                                `<div>${e.descr}</div>` +
                                `</div>`;
                        document.getElementById("doc").innerHTML += doc;
                    });                    
                }
            }
        }       
    }
}

function infoDoc(l){
    l = l.split("/")[3];
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `http://localhost:5000/api/infoDoc/${l}`, true);
    xhttp.send();
    
    document.getElementById("doc").innerHTML = "";

    xhttp.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200) {
            const infoD = JSON.parse(this.response).result;

            const html = `<div class="infoDoc">`+
                            `<div>N. Protocollo: ${infoD.nProt}</div> ` +
                            `<div>Ente Richiedente: ${infoD.enteRic}</div>` + 
                            `<div>Ufficio Richiedente: ${infoD.uffRic}</div>` + 
                            `<div>Ente Emittente: ${infoD.enteEmi}</div>` +
                            `<div>Ufficio Emittente: ${infoD.uffEmi}</div>` +
                            `<div>Tipo Atto: ${infoD.tipoAtto}</div>` +
                            `<div>Data Inizio: ${infoD.dataIn}</div>` +
                            `<div>Data Scadenza: ${infoD.dataScad}</div>` +
                            `<div>Oggetto: ${infoD.ogg}</div>` +
                            `<a href='https://albo.comune.parma.it${infoD.linkDoc}' target= "_blank" id="btOpenDoc">Apri Documento</a>` +
                         `</div>`;
            document.getElementById("doc").innerHTML += html;
        }
    }
}
