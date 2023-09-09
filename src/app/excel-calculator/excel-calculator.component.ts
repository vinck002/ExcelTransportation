import { Component } from '@angular/core';
import { read,utils,writeFile } from "xlsx";
import { DriverRow, ExcelFormat, THourPerDriver } from '../Interfaces/ExcelFormat';
@Component({
  selector: 'app-excel-calculator',
  templateUrl: './excel-calculator.component.html',
  styleUrls: ['./excel-calculator.component.css']
})
export class ExcelCalculatorComponent {
ExecellFileName:string=""
displayedColumns: string[] = ['Driver','Date', 'Account', 'Duration','totalAmount','Amount_Hour'];
dataSource:THourPerDriver[]= [];

DriverComputado: DriverRow[]=[]

  public SelectedFile(event:any):void 
  {
    this.realizarExcell(event);
  }

public realizarExcell(event:any){
  const fileInput = event.target.files[0];

  if (fileInput.name.length > 0) {
    var fileName = fileInput.name;
    this.ExecellFileName = fileName;

    let reader = new FileReader();
    
    reader.onload = (e) =>{
      const workBook = read(reader.result,{type: 'binary'})
      var sheetNames = workBook.SheetNames;

  if (sheetNames.length) {
    const rows:ExcelFormat[] = utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
   

   let driverEncontrado = rows.find((objeto) => objeto.Driver !== undefined);
   driverEncontrado!.Duration = this.convertirHorasAMinutos(driverEncontrado?.Duration ||'').toString();

   rows.filter(x => x.Duration).forEach((row,indice) =>
   {
     row.Date = this.GetFecha(row.Date).toDateString();
     
     if(indice !== 0){
      if (row.Driver){
        driverEncontrado = row;
      }
       row.Driver = driverEncontrado?.Driver;
       row.Duration = this.convertirHorasAMinutos(row.Duration ||'').toString();
      
     }
     
    });
    
   // console.log(rows)

    rows.filter(x => x.Date).forEach((row)=>
    {
        var rowEncontrada = this.DriverComputado.find((x)=> x.Driver.trim() === (row.Driver??"").trim() && x.Account.trim() === (row.Account??"").trim() && x.Date?.trim() === row.Date?.toString().trim());

        if(rowEncontrada){
          if(parseFloat(rowEncontrada!.Duration??0) < parseFloat(row.Duration!??0)){

            rowEncontrada!.Duration = row.Duration!
         
          }
        }else{
        this.DriverComputado.push({   
        Driver: row.Driver||'', 
        Date: row.Date?.toString(), 
        Account: row.Account ||'',
        Duration: row.Duration || ''
       ,totalAmount: row.totalAmount || 0});

        }
    // var rowEncontrada1 = this.DriverComputado.find(x => x.Date?.toString().replace('Totals','').includes(row.Driver?.toString().replace(/\s/g,'')! ));
    // console.log(rowEncontrada1)
    // if(rowEncontrada1 !== undefined){
    // console.log(rowEncontrada1)
    // }

  });
//   console.log(rows[128])
// console.log(rows[129])
//   console.log(this.DriverComputado)

  const totalsPerDriver: Record<string,THourPerDriver>={};
    this.DriverComputado.filter(x => x.Date !== undefined).forEach((row)=>
  {
    const{Driver,Duration} = row;
    if(totalsPerDriver[Driver]){
      totalsPerDriver[Driver].Duration! += parseFloat(Duration??'0.00');
      totalsPerDriver[Driver].totalAmount =row.totalAmount

    }else{
      totalsPerDriver[Driver] = {Driver: Driver, Duration: parseFloat(Duration),Date:row.Date,Account: row.Account,totalAmount:row.totalAmount,Amount_Hour:0}
    }

  });
  const DriverDurationReady = Object.values(totalsPerDriver).map(x =>x) ;

  
const totals = this.DriverComputado.filter(x =>x.Date && !x.Driver && x.totalAmount);//.sort((x,y) => x.Driver.localeCompare(y.Driver));
  
  totals.forEach((t) =>{
   const driver_tot =  t.Date!.replace('Totals','');
   const Drivertochange = DriverDurationReady.find(x=> x.Driver.trim().includes(driver_tot.trim()));
   
   if(Drivertochange){
    Drivertochange.totalAmount = t.totalAmount
   }
   DriverDurationReady.map(x => x.Amount_Hour = ((x.totalAmount??0) / (x.Duration||1)))


   });
  //console.log(totals);
    this.dataSource = DriverDurationReady
   //console.log(this.DriverComputado)
  }
  };

    reader.readAsBinaryString(fileInput)
  }
}

//FUNCIONES DE AQUI PARA ABAJO XD XD XD********************************************************************************8
//***********************************************************************************************************************8 */




public GetFecha(valorNumerico:any):Date{

 const fechaBase = new Date('1899-12-30'); // Fecha base de Excel
 const milisegundosPorDia = 24 * 60 * 60 * 1000; 
 const milisegundosDesdeFechaBase = valorNumerico * milisegundosPorDia;
 const fechaConvertida = new Date(fechaBase.getTime() + milisegundosDesdeFechaBase);
 return fechaConvertida;

}

public convertirHorasAMinutos(cadena: string): number {
  // Divide la cadena en las partes de horas y minutos

  const partesHoras = cadena.split("hrs");
  var partesMinutos:string[]=[];
  let horas = 0;
  let minutos = 0;

 if (partesHoras.length > 0) {
    // Extrae las horas y conviértelas en números
    horas = parseFloat(partesHoras[0].trim()) || 0;
  }

  if(!cadena.includes("hrs") && cadena.includes("min")) horas =0; 

  if (partesHoras.length > 1) {
    // Extrae los minutos y conviértelos en números
    partesMinutos= partesHoras[1].split("min");
    minutos = parseFloat(partesMinutos[0].trim()) || 0;
  }
  if (!cadena.includes("hrs") && cadena.includes("min")) minutos = parseFloat(cadena.split('min')[0].toString()) || 0

  // Convierte las horas y los minutos a minutos totales
  const resultado = parseFloat(`${horas}.${ (Math.round((minutos/60)*100)) >= 10? Math.round((minutos/60)*100): `0${Math.round((minutos/60)*100)}` }`); //horas * 60 + minutos;
  return resultado;
}


}


