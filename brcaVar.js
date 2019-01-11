console.log('brca.js loaded')
// written to be called equally well as script from browser or required in node

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
    this.unique=(arr)=>{
        var u = {}
        arr.forEach(v=>{
            if(typeof(v)!=='undefined'){
                //v=v.split(',')[0]
                if(!u[v]){u[v]=0}
                u[v]+=1    
            }
        })
        return u
    }
    this.adf={} //analytics data frame 
    this.parseDF=()=>{ // cleans dataframe at this.df
        var n = that.df.id.length-1 // remove last row, incomplete
        that.adf.id=that.df.id.slice(0,n)
        that.adf.Gene_Symbol=that.df.Gene_Symbol.slice(0,n)
        that.adf.Source=that.df.Source.slice(0,n)
        that.adf.Clinical_significance_ENIGMA=that.df.Clinical_significance_ENIGMA.slice(0,n)
        that.adf.Clinical_Significance_ClinVar=that.df.Clinical_Significance_ClinVar.slice(0,n)
           .map(x=>{
               if(x){
                   return x.split(',')[0] // only first label
               }else{
                   return '-'
               }
            }) 
        that.adf.Allele_Origin_ClinVar=that.df.Allele_Origin_ClinVar.slice(0,n)
        that.adf.Allele_Origin_ENIGMA=that.df.Allele_origin_ENIGMA.slice(0,n) // note case correction in [O]rigin
        that.adf.Clinical_importance_BIC=that.df.Clinical_importance_BIC.slice(0,n).map(x=>x.split(',')[0])
        that.adf.Clinical_classification_BIC=that.df.Clinical_classification_BIC.slice(0,n).map(x=>x.split(',')[0])
        // count database sources
        that.dbs={}
        that.adf.Source.forEach(str=>{
            if(str){
                str.split(',').forEach(db=>{
                    if(!that.dbs[db]){that.dbs[db]=0}
                    that.dbs[db]+=1
                })
            }  
        })
        // tabulate indexes to databases
        that.dbNames=Object.keys(brcaVar.dbs).sort()
        that.dbNames.forEach

        // Workflow
        that.workflow=[]
        that.workflowFlags=[]

        // indexes
        that.ind=[...Array(that.df.id.length)].map(_=>true)

        return that.dbs
    }
    this.uniqueLabels=(arr)=>{
        var u = {}
        arr.forEach(k=>{
            u[k]=true
        })
        return Object.keys(u)
    }
}

// UI from hereon, executed only when called from the App:

if(typeof(window)=='object'){ 
    window.onload=async ()=>{
        //document.body.style.backgroundColor="silver"
        var div = document.getElementById('brcaExchangeDiv')
        if(div){ // assemble UI
            let s = document.createElement('script')
            s.src="brcaVarUI.js"
            s.onload=()=>{
                brcaVarUI()
            }
            document.head.appendChild(s)
            //debugger
        }
    }
}
