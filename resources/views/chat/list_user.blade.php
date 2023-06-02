<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('List Users') }}
        </h2>
    </x-slot>

    <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        <div class="p-4 bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700 min-h-screen">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold leading-none text-gray-900 dark:text-white">List Customers</h3>
                <a href="{{ route('chat_all') }}" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                    To chat all
                </a>
            </div>
            <div class="flow-root">
                <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
                    @foreach ($users as $item)
                        <li class="py-3 sm:py-4">
                            <a href="{{ route('chat_user',  $item->id)}}">
                                <div class="flex items-center space-x-4">
                                    <div class="flex-shrink-0">
                                        <img class="w-8 h-8 rounded-full"
                                            src="{{ $item->profile_photo_path ?? 'https://flowbite.com/docs/images/people/profile-picture-5.jpg' }}"
                                            alt="{{ $item->name }}">
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            {{ $item->name }}
                                        </p>
                                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                            {{ $item->email }}
                                        </p>
                                    </div>
                                    <div
                                        class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                        {{ $item->team->name }}
                                    </div>
                                </div>
                            </a>
                        </li> 
                    @endforeach
                </ul>
            </div>
        </div>
    </div>
</x-app-layout>
