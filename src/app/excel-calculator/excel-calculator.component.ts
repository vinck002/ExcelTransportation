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
displayedColumns: string[] = ['Driver','Date', 'Account', 'Duration'];
dataSource:DriverRow[]= [];

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
   
   let hour = rows[6].Duration?.split("hrs");
   //console.log(rows)
  //   console.log(hour![0].split('min'));

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


    rows.filter(x => x.Date).forEach((row)=>
    {
        var rowEncontrada = this.DriverComputado.find((x)=> x.Account === row.Account && x.Date === row.Date
        && x.Driver === row.Driver);

        if(rowEncontrada){
        const driverToUpdate = this.DriverComputado.findIndex(x => x.Account === row.Account && x.Date === row.Date && x.Driver === row.Driver);

        if(this.DriverComputado[driverToUpdate].Duration < row.Duration! || 0){
        this.DriverComputado[driverToUpdate].Duration = row.Duration!
        }
        }else{
        this.DriverComputado.push({   
        Driver: row.Driver||'', 
        Date: row.Date?.toString(), 
        Account: row.Account ||'',
        Duration: row.Duration || ''
         ,totalAmount: row.totalAmount || 0});

        }
  });
  
  var totalsPerDriver: THourPerDriver[] = [];
    this.DriverComputado.filter(x => x.Account !== undefined).forEach((row)=>
  {
      const rowEncontrada = totalsPerDriver.find((x)=> x.Driver === row.Driver );
 
      if(rowEncontrada){
        //console.log(parseFloat(row.Duration??'0.00'))
        rowEncontrada.Duration = rowEncontrada.Duration??0 + parseFloat(row.Duration??'0.00') ;
        rowEncontrada.totalAmount = rowEncontrada.totalAmount ?? 0;
      }else{
      totalsPerDriver.push({   
      Driver: row.Driver||'', 
      Date: row.Date?.toString(), 
      Account: row.Account ||'',
      Duration: parseFloat(row.Duration??'0.00'),
      totalAmount: row.totalAmount || 0});

      }
});

    //console.log(totalsPerDriver);
  
    this.dataSource = this.DriverComputado   
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
  const resultado = parseFloat(`${horas}.${minutos}`); //horas * 60 + minutos;
  return resultado;
}


}


