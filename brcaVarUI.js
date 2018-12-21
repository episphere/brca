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
        var h = '<h4 style="color:#993300">Unique observations <span style="font-size:small">(can be used to check data parsing)</span></h4>'
        h += '<table><tr><td style="color:green">Raw data</td><td style="color:green">Parsed for analytics</td></tr><tr>'
        h += '<td><select id="uniqueSelect" style="vertical-align:top"><option>Select raw parameter</option></select> <pre id="uniqueArea" style="width:500;height:150;background-color:black;color:white;font-size:small"></pre></td>'
        h += '<td><i class="fa fa-arrow-right" aria-hidden="true"></i><select id="aUniqueSelect" style="vertical-align:top"><option>Select analytics parameter</option></select> <pre id="aUniqueArea" style="width:500;height:150;background-color:black;color:white;font-size:small"></pre></td>'
        h += '</tr></table>'
        h += '<hr> general purpose analytics comming next ..'
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
    }else{
        Error(' div not found ')
    }
}
