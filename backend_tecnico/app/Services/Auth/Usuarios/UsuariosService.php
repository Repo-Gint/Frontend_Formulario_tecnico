<?php

namespace App\Services\Auth\Usuarios;

use App\Models\TblSessions;
use App\Repositories\Auth\Usuarios\UsuariosRepository;
use Illuminate\Support\Str;

class UsuariosService
{
    protected $usuariosRepository;

    public function __construct(
        UsuariosRepository $UsuariosRepository
    ) {
        $this->usuariosRepository = $UsuariosRepository;
    }

    public function registrarUsuario($usuario)
    {
        $resultado = $this->usuariosRepository->validarUsuarioExistente($usuario['email']);

        if ($resultado > 0) {
            return response()->json([
                'success' => 204,
                'title'   => 'El correo electronico existente',
                'mensaje' => 'Ya existe un registro con el correo electronico escrito'
            ]);
        }

        $pkUsuario = $this->usuariosRepository->registrarUsuario($usuario);

        return response()->json(
            [
                'pkUsuario' => $pkUsuario,
                'mensaje'   => 'Se registro correctamente el usuario',
                'title'     => 'Registro exitoso'
            ]
        );
    }

    public function obtenerDetalleUsuario($pkUsuario)
    {
        $usuario = $this->usuariosRepository->obtenerDetalleUsuario($pkUsuario);

        return response()->json(
            [
                'usuario' => $usuario[0],
                'mensaje' => 'Se obtuvo la información correctamente'
            ]
        );
    }

    public function actualizarUsuario($usuario)
    {
        $this->usuariosRepository->actualizarUsuario($usuario['pkUsuario'], $usuario['usuario']);

        return response()->json(
            [
                'title'   => 'Actualización exitosa',
                'mensaje' => 'Se actualizó correctamente el usuario'
            ]
        );
    }

    public function login($usuario)
    {
        $resultado = $this->usuariosRepository->login($usuario);

        if ($resultado === 'no_usuario') {
            return response()->json([
                'success' => 204,
                'title'   => 'Usuario no encontrado',
                'mensaje' => 'El usuario no existe o las credenciales son incorrectas'
            ]);
        }

        if ($resultado === 'mal_contraseña') {
            return response()->json([
                'success' => 204,
                'title'   => 'Credenciales Incorrectas',
                'mensaje' => 'Las credenciales son incorrectas'
            ]);
        }

        $token = Str::random(60);

        TblSessions::create([
            'id_users' => (string)$resultado->id,
            'token' => hash('sha256', $token)
        ]);

        return response()->json([
            'usuarios' => $resultado,
            'token'    => $token,
            'mensaje'  => 'Inicio de sesión correctamente'
        ]);
    }

    public function cerrarSesion($request)
    {
        $header = $request->header('Authorization');

        if (!$header || !str_starts_with($header, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Token no proporcionado'
            ], 401);
        }

        $token = str_replace('Bearer ', '', $header);

        $eliminado = $this->usuariosRepository->cerrarSesion($token);

        return response()->json([
            'success' => (bool) $eliminado,
            'mensaje' => $eliminado
                ? 'Sesión cerrada con éxito'
                : 'No se encontró la sesión'
        ]);
    }
}
