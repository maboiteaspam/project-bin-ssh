
var pkg = require("./package.json");
var Cluc = require("cluc");
var program = require("commander");
var Config = require("project-bin-config");

program
  .version(pkg.version)

  .command('exec <env> <cmd>')
  .description('Exec a command over ssh')
  .action(function (env, command) {
    (new Config()).load().get(env)
      .forEach(function(machine){
        var clucLine = (new Cluc())
          .stream(command, function(){
            this.display();
          });
        (new (Cluc.transports.ssh)()).run(clucLine, machine.ssh, function(){});
      });
  });

program
  .command('run <env> <cmd>')
  .description('Run a command over ssh')
  .action(function (env, command) {
    (new Config()).load().get(env)
      .forEach(function(machine){
        var clucLine = (new Cluc())
          .tail(command, function(){
            this.display();
          });
        (new (Cluc.transports.ssh)()).run(clucLine, machine.ssh, function(){});
      });
  });


program
  .command('*').description('help')
  .action(function(){
    program.outputHelp();
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
