<?php
class UsuarioControle{

    function __construct( ) {
    }

    static function isLogado() {
    	$headers = getallheaders() ;
    	if ( isset($headers['Authorization']) ) {
            try {
            	include_once '../includes/php-jwt/vendor/autoload.php';
            	$token = substr($headers['Authorization'],7);
                $decoded = \Firebase\JWT\JWT::decode($token, SECRET_SERVER, array('HS512'));
                return true;
            } catch (\Firebase\JWT\ExpiredException $e){
            	echo '{ "situacao" : "token_expirado"}';
            	return false;
            }
            catch (Exception $e){
            }
        } 
        echo '{ "situacao" : "nao_autenticado"}';
        return false;
    }
    
    static function geraSenha($tamanho = 8, $maiusculas = true, $numeros = true, $simbolos = true)
    {
    	$lmin = 'abcdefghijklmnopqrstuvwxyz';
    	$lmai = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    	$num = '1234567890';
    	$simb = '!@#$%*-';
    	$retorno = '';
    	$caracteres = '';
    	$caracteres .= $lmin;
    	if ($maiusculas) $caracteres .= $lmai;
    	if ($numeros) $caracteres .= $num;
    	if ($simbolos) $caracteres .= $simb;
    	$len = strlen($caracteres);
    	for ($n = 1; $n <= $tamanho; $n++) {
    		$rand = mt_rand(1, $len);
    		$retorno .= $caracteres[$rand-1];
    	}
    	return $retorno;
    }
    
    static function login_via_token($con, $usuario, $device_id, $usuario_id, $senha_renovacao) {
    	include_once '../includes/php-jwt/vendor/autoload.php';
    	
    	$token = array(
    			"sub" => $usuario,
    			"exp" => strtotime("+30 minute")
    	);
    	$jwt = \Firebase\JWT\JWT::encode($token, SECRET_SERVER, 'HS512');
    	
    	$sql = '
			SELECT
				id
			FROM
				usuarios_logados
			WHERE
				usuario_id = "'.formata_valor_sql($usuario_id).'"
				AND device_id = "'.formata_valor_sql($device_id).'"
			LIMIT 1';
    	$query = $con->query($sql);
    	$nreg = $con->num_rows( $query );
    	
    	if ( $nreg > 0 ){
    		$sql = '
			UPDATE usuarios_logados
			SET
				senha_renovacao = "'.formata_valor_sql($senha_renovacao).'"
			WHERE
				usuario_id = "'.formata_valor_sql($usuario_id).'"
				AND device_id = "'.formata_valor_sql($device_id).'"
		';
    		$query = $con->query($sql);
    	} else {
    		$sql = '
			INSERT INTO usuarios_logados
			(
				usuario_id,
				device_id,
				senha_renovacao,
				log
			) VALUES (
				"'.formata_valor_sql($usuario_id).'",
				"'.formata_valor_sql($device_id).'",
				"'.formata_valor_sql($senha_renovacao).'",
				"poc"
			)
		';
    		$query = $con->query($sql);
    	}
    	return $jwt;
    }
}
?>