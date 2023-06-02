<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])

        <!-- Styles -->
        @livewireStyles
        <style>
            html {
                scroll-behavior: smooth;
            }
        </style>
    </head>
    <body class="font-sans antialiased">
        <x-banner />

        <div class="min-h-screen bg-gray-100">
            @livewire('navigation-menu')

            <!-- Page Heading -->
            @if (isset($header))
                <header class="bg-white shadow">
                    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {{ $header }}
                    </div>
                </header>
            @endif

            <!-- Page Content -->
            <main>
                {{ $slot }}
            </main>
        </div>
        @include('layouts.modal')
        @stack('modals')

        @livewireScripts
        <script src="https://code.jquery.com/jquery-3.6.0.js" 
            integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
        <script src="{{ asset('plugin/js/socket.io.min.js') }}"></script>
        <script src="{{ asset('plugin/js/firebasejs/firebase-app.js') }}"></script>
        <script src="{{ asset('plugin/js/firebasejs/firebase-storage.js') }}"></script>
        <script>
            const ip_address = "{{ env('DB_HOST') }}";
            const socket_port = "{{ env('PORT_SERVE_NODE') }}";
            // // let socket = io('http://localhost:3000');
            const userLogin = {
                id: {{ auth()->user()->id }},
                name: "{{ auth()->user()->name }}",
                avatar: "{{ auth()->user()->profile_photo_path }}"
            }
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
        </script>
        <script>
            $('.modal').click(function() {
                $("#" + $(this).attr("data-modal-target")).removeClass("hidden");
            });

            $('.close-modal').click(function() {
                $("#" + $(this).attr("data-modal-hide")).addClass("hidden");
            });
        </script>
        <script>
            const firebaseConfig = {
                apiKey: "AIzaSyC6g0Uagj1ydW-qkowcL2H8o_zhxq5T_ck",
                authDomain: "fir-notification-ex-f5bb1.firebaseapp.com",
                projectId: "fir-notification-ex-f5bb1",
                storageBucket: "fir-notification-ex-f5bb1.appspot.com",
                messagingSenderId: "812519291887",
                appId: "1:812519291887:web:c489875e866f7200d1541a",
                measurementId: "G-935SN0SQPT"
            };
        </script>
    </body>
</html>
