
import program from 'commander'


function mapdata(){
  console.log("heu")
}


program
  .requiredOption('-m, --mapping <string>', 'mapping argument', JSON.parse)
  .requiredOption('-d, --dimensions <string>', 'dimensions argument', JSON.parse)
  .requiredOption('-f, --csv <string>', 'csv file argument')


// allow commander to parse `process.argv`
program.parse(process.argv);


