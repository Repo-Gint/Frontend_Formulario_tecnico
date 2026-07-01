<?php

namespace App\Repositories\Auth\Usuarios;

use App\Models\TblSessions;
use App\Models\TblUsuarios;

class UsuariosRepository
{
    public function validarUsuarioExistente($correo)
    {
        $query = TblUsuarios::where('email', $correo);

        return $query->count();
    }

    public function registrarUsuario($usuario)
    {

        $registro = new TblUsuarios();

        $registro->name         = $usuario['name'];
        $registro->email        = $usuario['email'];
        $registro->password     = bcrypt($usuario['password']);
        $registro->save();

        return (string) $registro->_id;
    }

    public function obtenerDetalleUsuario($pkUsuario)
    {
        $query = TblUsuarios::select(
            '_id',
            'name',
            'email',
            'password'
        )

            ->where('_id', $pkUsuario);

        return $query->get();
    }

    public function actualizarUsuario($id, $usuario)
    {
        $actualizar = TblUsuarios::findOrFail($id);

        $actualizar->name =  $usuario['name'];
        $actualizar->email = $usuario['email'];
        $actualizar->save();
    }

    public function login($usuario)
    {
        $usuarioEncontrado = TblUsuarios::where('email', $usuario['email'])
            ->first();

        if (!$usuarioEncontrado) return 'no_usuario';
        if (!password_verify($usuario['password'], $usuarioEncontrado->password)) return 'mal_contraseña';;

        return $usuarioEncontrado;
    }

    public function cerrarSesion($token)
    {
        return TblSessions::where('token', hash('sha256', $token))->delete();
    }
}
