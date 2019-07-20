import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage} from '@ionic/storage';
import 'rxjs/add/operator/map';
import { AppConfig } from './app-config';

/*
  Generated class for the ServicoAutenticacao provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ServicoAutenticacao {
		

	URL_LOGIN : string = AppConfig.URL_API + '/usuario/usuario_servico.php'
	contentHeader: Headers = new Headers({"Content-Type": "application/json"});

	constructor(public http: Http) {
	}

	login(resposta:Function, usuario:string, senha:string) {
		let body = {
	    				"acao" : "logar",
	    				"usuario" : usuario,
	    				"senha" : senha,
	    				"device_id" : AppConfig.DEVICE_ID
	    			};
	    
	    this.http.post(this.URL_LOGIN, body,
	    					 		{ headers: this.contentHeader }
	    )
	    .map(res => res.json())
	    .subscribe(
	        (data) => {
	        	if (data.situacao == 'ok') {
	        		this.armazenarToken(data,resposta);
	        		resposta(true);
	        	} else {
	        		resposta(data.mensagem);
	        	}
	        },
	        (err) => {resposta("Sem rede disponível");}
	      );
  }

  renovarLogin(resposta:Function, usuario_id:string, senha_renovacao:string, usuario:string) {
	let body = {
				"acao" : "renovar",
				"usuario" : usuario,
				"usuario_id" : usuario_id,
				"senha_renovacao" : senha_renovacao,
				"device_id" : AppConfig.DEVICE_ID
			};

	this.http.post(this.URL_LOGIN, body,
						 		{ headers: this.contentHeader }
	)
	.map(res => res.json())
	.subscribe(
	    (data) => {
	    	if (data.situacao == 'ok') {
	    		this.armazenarToken(data,resposta);
	    	} else {
	    		resposta(data.mensagem);
	    	}
	    },
	    (err) => {resposta("Sem rede disponível");}
	  );	
  }

  criarUsuario(resposta:Function, nome:string, usuario:string, senha:string) {
 	let body = {
	    			"acao" : "novo_usuario",
	    			"usuario" : usuario,
	    			"senha" : senha,
	    			"nome" : nome
	    		};
	    
	    this.http.post(this.URL_LOGIN, body,
	    					 		{ headers: this.contentHeader }
	    )
	    .map(res => res.json())
	    .subscribe(
	        (data) => {
	        	if (data.situacao == 'ok') {
	        		resposta(true);
	        	} else {
	        		resposta(data.mensagem);
	        	}
	        },
	        (err) => {resposta("Sem rede disponível")}
	    );	
  }

  getToken(resposta:Function) {
  	let storage = new Storage();
  	storage.get("autenticacao").then((autenticacao) => {
  		let dataAtual = new Date();
  		if ( autenticacao === null){
  			resposta(null);
		} else {
			if ( autenticacao.exp_time >= dataAtual.valueOf() ) {	
				resposta(autenticacao.token);
			} else {
				this.renovarLogin( (resposta_renovacao) => {
					if (resposta_renovacao == true) {
						this.getToken(resposta);
					} else {
						resposta(null);
					}
				},
				autenticacao.usuario_id, autenticacao.senha_renovacao, autenticacao.usuario); 
			}
		}
  	});
  }

  getUsuarioLogadoId(resposta:Function) {
  	let storage = new Storage();
  	storage.get("autenticacao").then((autenticacao) => {
  		if ( autenticacao !== undefined )
  			resposta(autenticacao.usuario_id);
  		else 
  			resposta(null);
  	});
  }

  armazenarToken(data:any, resposta:Function){
  	let storage = new Storage();
	let dataAtual = new Date();
	dataAtual.setMinutes(dataAtual.getMinutes() + 30 );
	storage.ready().then(() => {
		let autenticacao = {
							"usuario": data.usuario,
							"token" : data.token,
							"exp_time": dataAtual.valueOf(),
							"usuario_id": data.usuario_id,
							"senha_renovacao" : data.senha_renovacao
		};
		storage.set("autenticacao",autenticacao);
		storage.set("primeiraVez", false);
		if ( resposta != undefined ){
			resposta(true);
		}
	})
  }

}
