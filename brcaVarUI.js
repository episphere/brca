brcaVarUI = async(div)=>{
    //document.body.style.backgroundColor="silver"
    div = div||document.getElementById('brcaExchangeDiv')
    if(div){ // assemble UI
        // get the data as an data frame (df)
        var notice={
            start:function(txt){
                msg.textContent=txt
                msg.style.color=catIcon.style.color='maroon'
            },
            end:function(txt){
                msg.textContent=txt
                msg.style.color=catIcon.style.color='green'
                setTimeout(_=>{
                    msg.textContent=''
                    msg.style.color=catIcon.style.color='blue'
                },2000)
            }
        }
        notice.start('loading data ...')
        await brcaVar.getDF() // stores it at brcaVar.df
        brcaVar.parseDF()
        notice.end(`loaded ${brcaVar.df['id'].length} reccords with ${Object.keys(brcaVar.df).length} parameters`)

        // Create graphics
        var h = '<h4 style="color:#993300">Unique observations <span style="font-size:small">(check data parsing)</span></h4>'
        h += '<table><tr><td style="color:green">Raw data</td><td style="color:green">Parsed for analytics</td></tr><tr>'
        h += '<td><select id="uniqueSelect" style="vertical-align:top"><option>Select raw parameter</option></select> <pre id="uniqueArea" style="width:500;height:150;background-color:black;color:white;font-size:small"></pre></td>'
        h += '<td><i class="fa fa-arrow-right" aria-hidden="true"></i><select id="aUniqueSelect" style="vertical-align:top"><option>Select analytics parameter</option></select> <pre id="aUniqueArea" style="width:500;height:150;background-color:black;color:white;font-size:small"></pre></td>'
        h += '</tr></table>'
        h += '<hr> general purpose analytics comming next ...<hr>'
        h += '<h4 style="color:#993300">Interactive workflow</h4>'
        h += '<div id="workflowDiv"></div>'
        h += '<table id="sourceTable"></table>'
        divPlotTabulator.innerHTML=h
        Object.keys(brcaVar.df).forEach(k=>{
            var op = document.createElement('option')
            op.value=op.text=k
            uniqueSelect.appendChild(op)
        })
        uniqueSelect.onchange=()=>{
            var k = uniqueSelect.selectedOptions[0].label
            // count unique onto textarea
            var u = brcaVar.unique(brcaVar.df[k])
            var ku = Object.keys(u).sort()
            var h ='<ol>'
            ku.forEach(ki=>{
                h += `<li><span style="color:orange">${ki}</span> <span style="color:cyan">:</span> <span style="color:lime">${u[ki]}</span></li>`
            })
            h += '</ol>'
            uniqueArea.innerHTML=h
        }
        Object.keys(brcaVar.adf).forEach(k=>{
            var op = document.createElement('option')
            op.value=op.text=k
            aUniqueSelect.appendChild(op)
        })
        aUniqueSelect.onchange=()=>{
            var k = aUniqueSelect.selectedOptions[0].label
            // count unique onto textarea
            var u = brcaVar.unique(brcaVar.adf[k])
            var ku = Object.keys(u).sort()
            var h ='<ol>'
            ku.forEach(ki=>{
                h += `<li><span style="color:orange">${ki}</span> <span style="color:cyan">:</span> <span style="color:lime">${u[ki]}</span></li>`
            })
            h += '</ol>'
            aUniqueArea.innerHTML=h
        }
        // tabulate ClinVar and ENIGMA significances
        var divWork=document.getElementById('workflowDiv')
        divWork.appendChild(brcaVarUI.tabulate('Clinical_Significance_ClinVar','Clinical_significance_ENIGMA'))
        divWork.appendChild(document.createElement('hr'))
        divWork.appendChild(brcaVarUI.tabulate('Allele_Origin_ClinVar','Allele_Origin_ENIGMA'))

    }else{
        Error(' div not found ')
    }
}



brcaVarUI.tabulate=function(ki,kj){
    var Ui = brcaVar.uniqueLabels(brcaVar.adf[ki]).sort()
    var UiInd={};Ui.forEach((k,i)=>{UiInd[k]=i})
    var Uj = brcaVar.uniqueLabels(brcaVar.adf[kj]).sort()
    var UjInd={};Uj.forEach((k,j)=>{UjInd[k]=j})
    // enveloping table
    var tb = document.createElement('table')
    var tr1 = document.createElement('tr');tb.appendChild(tr1)
    var td11 = document.createElement('td');tr1.appendChild(td11)
    var td12 = document.createElement('td');tr1.appendChild(td12)
    var tr2 = document.createElement('tr');tb.appendChild(tr2)
    var td21 = document.createElement('td');tr2.appendChild(td21)
    var td22 = document.createElement('td');tr2.appendChild(td22)
    //td11.style.transform="rotate(270Deg)"
    td12.style.textAlign="right"
    td12.innerHTML=`<b style="color:green">${kj}</b>`
    // counts table
    var ctb = document.createElement('table')
    td22.appendChild(ctb)
    var tr0 = document.createElement('tr');ctb.appendChild(tr0) // top row
    var td00 = document.createElement('td');tr0.appendChild(td00) // upper left corner of the table
    td00.innerHTML=`<b style="color:navy">${ki}</b>`
    Uj.forEach(u=>{
        var td = document.createElement('td');tr0.appendChild(td)
        td.innerHTML=`${u}`
        td.style.color="green"
        td.style.textAlign="center"
        td.style.cursor="hand"
        td.onmouseover=brcaVarUI.overColumnLabel
        td.onmouseleave=brcaVarUI.leaveColumnLabel
    })
    var cts = [] 
    Ui.forEach((ui,i)=>{ // count first
        cts[i]=[]
        Uj.forEach((ui,j)=>{
            cts[i][j]=[]
        })
    })
    brcaVar.adf.id.forEach((_,ind)=>{
        cts[UiInd[brcaVar.adf[ki][ind]]][UjInd[brcaVar.adf[kj][ind]]].push(ind)
    })
    Ui.forEach((ui,i)=>{ // then tabulate 
        var tr = document.createElement('tr');ctb.appendChild(tr)
        var td = document.createElement('td');tr.appendChild(td) // ith label
        td.onmouseover=brcaVarUI.overRowLabel
        td.onmouseleave=brcaVarUI.leaveRowLabel
        td.style.cursor="hand"
        td.innerHTML=`${ui}`
        td.style.color="navy"
        Uj.forEach((ui,j)=>{
            var td = document.createElement('td');tr.appendChild(td) // ith label
            td.innerHTML=`<span class="sum">${cts[i][j].length}</span>/<span class="total" style="font-size:small">${cts[i][j].length}</span>`
            td.style.textAlign="center"
            td.style.backgroundColor="silver"
            td.style.color="blue"
            td.style.cursor="hand"
            td.onclick=brcaVarUI.selectCellCount
            td.onmouseover=brcaVarUI.overCellCount
            td.onmouseleave=brcaVarUI.leaveCellCount
            td.classList.add('count')
            td.varInd=cts[i][j]
            td.checkedOut=false
        })
    })
    brcaVarUI.ind=brcaVar.ind;
    return tb
}
brcaVarUI.selectCellCount=function(evt){
    if(this.style.backgroundColor=="white"){
        this.style.backgroundColor="silver"
        this.style.color="blue"
        this.checkedOut=false
    }else{
        this.style.backgroundColor="white"
        this.style.color="silver"
        this.checkedOut=true
    }
    brcaVarUI.recount(this)
    //debugger
}

brcaVarUI.recount=function(td){
    brcaVarUI.ind=[...brcaVar.ind];
    // falsify checked-out indexes
    var tds=[...workflowDiv.querySelectorAll('td.count')]
    tds.forEach(function(td){
        if(td.checkedOut){
            td.varInd.forEach(i=>{
                brcaVarUI.ind[i]=false
            })
        }
    })
    // recount
    tds.forEach(td=>{
        var c=0
        td.varInd.forEach(i=>{c=c+brcaVarUI.ind[i]})
        td.querySelector('.sum').textContent=c
        //debugger
    })
    
}

brcaVarUI.overCellCount=function(evt){
    var j = this.cellIndex
    var i = this.parentElement.rowIndex
    this.parentElement.parentElement.rows[0].cells[j].style.backgroundColor="yellow"
    this.parentElement.cells[0].style.backgroundColor="yellow"
    this.style.border="solid"
    this.style.borderColor="maroon"
    //debugger
}
brcaVarUI.leaveCellCount=function(evt){
    var j = this.cellIndex
    var i = this.parentElement.rowIndex
    this.parentElement.parentElement.rows[0].cells[j].style.backgroundColor=""
    this.parentElement.cells[0].style.backgroundColor=""
    this.style.border=""
}
brcaVarUI.overRowLabel=function(evt){
    var i = this.parentElement.rowIndex
    this.parentElement.style.border="solid"
    this.style.backgroundColor="yellow"
    //debugger
}
brcaVarUI.leaveRowLabel=function(evt){
    var i = this.parentElement.rowIndex
    this.parentElement.style.border=""
    this.style.backgroundColor=""
    //debugger
}
brcaVarUI.overColumnLabel=function(evt){
    var j = this.cellIndex
    var n = this.parentElement.parentElement.rows.length
    this.style.borderTop="solid"
    this.style.backgroundColor="yellow"
    var td
    for (var i=0;i<n;i++){
        td = this.parentElement.parentElement.rows[i].cells[j]
        td.style.borderLeft=td.style.borderRight="solid"
    }
    td.style.borderBottom="solid"
    
    //this.parentElement.style.border="solid"
    //debugger
}
brcaVarUI.leaveColumnLabel=function(evt){
    var j = this.cellIndex
    var n = this.parentElement.parentElement.rows.length
    for (var i=0;i<n;i++){
        let td = this.parentElement.parentElement.rows[i].cells[j]
        td.style.border=""
    }
    this.style.backgroundColor=""
    //this.parentElement.style.border="solid"
    //debugger
}

brcaVarUI.array2obj=(arr)=>{
    var y = {}
    arr.forEach(a=>{
        y[a]=true
    })
    return y
}