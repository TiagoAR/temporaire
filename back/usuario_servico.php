<?php
	include_once '../conexao.php';
	include_once "../funcoes.php";
	include_once "../config.php";
	include_once "usuario_controle.php";

	header('Content-Type: application/json');
	$POST_PARAMS = json_decode(file_get_contents('php://input'),true);

	$acao =  $POST_PARAMS['acao'];

	switch ($acao) {
		case 'novo_usuario':
			$retorno = array();

			$usuario = $POST_PARAMS['usuario'];
			$nome = $POST_PARAMS['nome'];
			$senha = $POST_PARAMS['senha'];

			if ( strlen($usuario) > 0 && strlen($nome) > 0 && strlen($senha) > 0) {
				//checa se usuario já existe
				$sql = '
						SELECT 
							id
						FROM 
							usuarios
						WHERE
							usuario = "'.formata_valor_sql($usuario).'"
						LIMIT 1';
				$query = $con->query($sql);
				$nreg = $con->num_rows( $query ); 
				if ( $nreg == 0 ) { 
					$sql = '
					INSERT INTO usuarios
					(
						nome,
						usuario,
						senha,
						log
					) VALUES (
						"'.formata_valor_sql($nome).'",
						"'.formata_valor_sql($usuario).'", 
						"'.formata_valor_sql($senha).'",
						"poc"
					)
					';
					$query = $con->query($sql);
					echo '{ "situacao" : "ok"}';
				} else {
					echo '{ "situacao" : "erro",' . '"mensagem" : "Usuário já existe"}';
				}
			} else {
				echo '{ "situacao" : "erro",' . '"mensagem" : "Informações não passadas corretamente"}';
			}

			break;


		case 'logar':
			$retorno = array();

			$usuario = $POST_PARAMS['usuario'];
			$device_id = $POST_PARAMS['device_id'];
			$senha = $POST_PARAMS['senha'];

			if ( strlen($usuario) > 0 && strlen($senha) > 0 && strlen($device_id) > 0) {

				$sql = '
						SELECT
							id, 
							senha
						FROM 
							usuarios
						WHERE
							usuario = "'.formata_valor_sql($usuario).'"
						LIMIT 1';
				$query = $con->query($sql);
				$nreg = $con->num_rows( $query );
				$usuario_id = $con->result($query,0,'id');
				$senha_renovacao = UsuarioControle::geraSenha();
				
				if ( $nreg > 0  && $con->result($query,0,'senha') == $senha) { 
					$jwt = UsuarioControle::logar_via_token($con, $usuario, $device_id, $usuario_id, $senha_renovacao);
					echo '{ "situacao" : "ok",' . '"token" : "'.$jwt.'", "senha_renovacao" : "'.$senha_renovacao.'", "usuario_id" : "'.$usuario_id.'", "usuario" : "'.$usuario.'"}';
				} else {
					echo '{ "situacao" : "erro",' . '"mensagem" : "Usuário ou senha incorreto"}';
				}
			} else {
				echo '{ "situacao" : "erro",' . '"mensagem" : "Informações não passadas corretamente"}';
			}
					
			break;
			
		case 'renovar':
			$retorno = array();
			
			$usuario = $POST_PARAMS['usuario'];
			$usuario_id = $POST_PARAMS['usuario_id'];
			$device_id = $POST_PARAMS['device_id'];
			$senha_renovacao = $POST_PARAMS['senha_renovacao'];
			
			if ( strlen($usuario) > 0 &&  strlen($usuario_id) > 0 && strlen($senha_renovacao) > 0 && strlen($device_id) > 0 ) {
				$sql = '
						SELECT
							senha_renovacao
						FROM
							usuarios_logados
						WHERE
							usuario_id = "'.formata_valor_sql($usuario_id).'"
							AND device_id = "'.formata_valor_sql($device_id).'"
						LIMIT 1';
				$query = $con->query($sql);
				$nreg = $con->num_rows( $query );
				if ( $nreg > 0  && $con->result($query,0,'senha_renovacao') == $senha_renovacao) {
					$senha_renovacao = UsuarioControle::geraSenha();
					$jwt = UsuarioControle::logar_via_token($con, $usuario, $device_id, $usuario_id, $senha_renovacao);
					echo '{ "situacao" : "ok",' . '"token" : "'.$jwt.'", "senha_renovacao" : "'.$senha_renovacao.'", "usuario_id" : "'.$usuario_id.'", "usuario" : "'.$usuario.'"}';
				} else {
					echo '{ "situacao" : "erro",' . '"mensagem" : "Desculpe, Não foi possível continuar logado.. Por favor Logue novamente..."}';
				}
			} else {
				echo '{ "situacao" : "erro",' . '"mensagem" : "Informações não passadas corretamente"}';
			}
			break;
		
		default:
			echo 'error';
			break;
	}

?>