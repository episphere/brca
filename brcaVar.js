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
}

// style
if(typeof(window)=='object'){ 
        window.onload=()=>{
        document.body.style.backgroundColor="silver"
    }
}
