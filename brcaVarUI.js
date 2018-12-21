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
        notice.end(`loaded ${brcaVar.df['id'].length} reccords with ${Object.keys(brcaVar.df).length} parameters`)

        // Create graphics
        var h = '<h4>Unique observations <span style="font-size:small">(check for debugging)</span></h4>'
        h += '<select id="uniqueSelect" style="vertical-align:top"><option>Select parameter</option></select> <pre id="uniqueArea" style="width:500;height:150;background-color:black;color:lime;font-size:small"></pre>'
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
            var h =''
            ku.forEach(ki=>{
                h += `<li><span style="color:orange">${ki}</span> <span style="color:cyan">:</span> ${u[ki]}</li>`
            })
            uniqueArea.innerHTML=h
        }
    }else{
        Error(' div not found ')
    }
}
