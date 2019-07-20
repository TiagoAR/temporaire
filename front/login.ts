import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ServicoAutenticacao } from '../../providers/servico-autenticacao';
import { ServicoMensagem } from '../../providers/servico-mensagem';
import { Chat } from '../chat/chat';
import { LoginNovo } from '../login/novo';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  user: string = ''; 
  password: string = '';
  msgErro: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public servicoAutenticacao: ServicoAutenticacao, public servicoMensagem: ServicoMensagem) {
  }

  login() {
    this.servicoAutenticacao.login( (resposta) => {
      if (resposta === true) {
        this.servicoMensagem.iniciarChat();
        this.navCtrl.setRoot(Chat);  
      } else {
        this.msgErro = resposta;  
        setTimeout( () => {
          this.msgErro = '';
        }, 3000);
      }
    },
     this.user, this.password);
  }

  novoUsuario() {
    this.navCtrl.setRoot(LoginNovo);  
  }
}
