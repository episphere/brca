console.log('brca.js loaded')


brcaVar = new function(){
    const that = this
    this.url = "https://brcaexchange.org/backend/data/?format=json"
    this.getAPIdata=async (q)=>{
        //q=q||"&order_by=Gene_Symbol&direction=ascending&page_size=30000&page_num=0&search_term=&include=Variant_in_ENIGMA&include=Variant_in_ClinVar&include=Variant_in_1000_Genomes&include=Variant_in_ExAC&include=Variant_in_LOVD&include=Variant_in_BIC&include=Variant_in_ESP&include=Variant_in_exLOVD"
        q=q||"&order_by=Gene_Symbol&direction=ascending&search_term=&include=Variant_in_ENIGMA&include=Variant_in_ClinVar&include=Variant_in_1000_Genomes&include=Variant_in_ExAC&include=Variant_in_LOVD&include=Variant_in_BIC&include=Variant_in_ESP&include=Variant_in_exLOVD"
        that.data = (await (await fetch(that.url+q)).json()).data
        console.log(`loaded ${that.data.length} reccords`)
        return that.data
    }
    this.data=null
    this.getData= async function(){
        if(!that.data){
            that.data = await (await fetch('data.json')).json()
            console.log(`loaded ${that.data.length} records`)
        }
        return that.data
        // loading data synchronously:
        // await brcaVar.getData() will load data synchronously
        // loading data asynchronously:
        // brcaVar.getData().then(x=>console.log(`loaded ${x.length} reccords`)) 
    }
    this.tsv=null
    this.getTSV=async function(){
        if(!this.tsv){
           that.tsv = (await (await fetch('variants.tsv')).text())
           that.tsvArray=that.tsv.split('\n').map(x=>x.split('\t'))
           console.log(`loaded ${that.tsv.length}-long string`)
        }

    }
    this.df=null // dataframe
    this.getDF= async ()=>{ // get data and assemble dataframe while going easy on memeory
        if(!that.df){
            let tsv = (await (await fetch('variants.tsv')).text())
            let tsvArray = tsv.split('\n').map(x=>x.split('\t'))
            that.df = {}
            tsvArray[0].forEach((k,i)=>{
                that.df[k]=tsvArray.slice(1).map(r=>r[i])
                //debugger
            })
        }
        return that.df // to actually return it use await, i.e. df=await brcaVar.getDF()
    }
}

// UI, applicable

if(typeof(window)=='object'){ 
    window.onload=async ()=>{
        //document.body.style.backgroundColor="silver"
        var div = document.getElementById('brcaExchangeDiv')
        if(div){ // assemble UI
            // get the data as an data frame (df)
            notice={
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

            //debugger

        }
    }
}
