<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function index()
    {
        $data = [
            'title' => 'Hub-Winnicode',
            'name' => ['Login', 'login'],
            'form' => [
                ['email', 'email', 'Email Address'],
                ['password', 'password', 'Password'],
            ]
        ];
        return view('auth.index', $data);
    }

    public function authenticate(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // return var_dump($request->all());

        if (Auth::attempt($request->only('email', 'password'))) {
            $request->session()->regenerate();
            $role = Auth::user()->role;

            if ($role === 'admin') {
                return redirect()->route('admin.dashboard');
            } elseif ($role === 'mentor') {
                return redirect()->route('mentor.dashboard');
            } elseif ($role === 'participant') {
                return redirect()->route('participant.dashboard');
            }

            // fallback: jika role tidak dikenal
            Auth::logout();
            return redirect()->route('login')->with('error', 'Role tidak dikenali.');
        }

        return back()->withErrors([
            'email' => 'Email atau password salah.',
        ])->withInput();
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'Logout berhasil!');
    }
}
