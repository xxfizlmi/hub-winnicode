<div class="bg-white p-6 rounded shadow-md w-full md:w-2/3 mx-auto">
    <h2 class="text-2xl font-bold mb-4">Profil Peserta</h2>
    <div class="flex flex-col md:flex-row gap-6">
        <div class="w-full md:w-1/3">
            <img src="{{ $participant->photo_url ?? asset('default-avatar.png') }}"
                class="rounded-full w-48 h-48 object-cover mx-auto" />
            <button onclick="editProfile()" class="bg-blue-500 text-white px-4 py-2 rounded">Edit Profil</button>

        </div>
        <div class="w-full md:w-2/3 space-y-2 flex flex-col gap-3 ">
            <div class="flex flex-row gap-3">
                <p class="text-xl w-36">Nama</p>
                <p class="text-xl w-full"><span class="mr-1">:</span>{{ $participant->name }}</p>
            </div>
            <div class="flex flex-row gap-3">
                <p class="text-xl w-36">Email</p>
                <p class="text-xl w-full"><span class="mr-1">:</span>{{ $participant->user->email }}</p>
            </div>
            <div class="flex flex-row gap-3">
                <p class="text-xl w-36">Nomor HP</p>
                <p class="text-xl w-full"><span class="mr-1">:</span>{{ $participant->phone ?? '-' }}</p>
            </div>
            <div class="flex flex-row gap-3">
                <p class="text-xl w-36">Institusi</p>
                <p class="text-xl w-full"><span class="mr-1">:</span>{{ $participant->institution ?? '-' }}</p>
            </div>
            <div class="flex flex-row gap-3">
                <p class="text-xl w-36">Divisi</p>
                <p class="text-xl w-full"><span class="mr-1">:</span> {{ $participant->division ?? '-' }}</p>
            </div>
            <button onclick="editProfile()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Edit Profil
            </button>
        </div>
    </div>
</div>
