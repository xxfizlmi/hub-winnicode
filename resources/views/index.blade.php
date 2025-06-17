<!DOCTYPE html>
<html lang="en" data-pc-preset="preset-1" data-pc-sidebar-caption="true" data-pc-direction="ltr" dir="ltr"
    data-pc-theme="light">

<!-- [Head] start -->
@include('layouts.head')
<!-- [Head] end -->

<!-- [Body] Start -->

<body>

    <div id="loading-overlay" class="hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="text-white text-xl">Loading...</div>
    </div>

    <!-- [ Pre-loader ] start -->
    <div class="loader-bg fixed inset-0 bg-white dark:bg-themedark-cardbg z-[1034]">
        <div class="loader-track h-[5px] w-full inline-block absolute overflow-hidden top-0">
            <div
                class="loader-fill w-[300px] h-[5px] bg-primary-500 absolute top-0 left-0 animate-[hitZak_0.6s_ease-in-out_infinite_alternate]">
            </div>
        </div>
    </div>
    <!-- [ Pre-loader ] End -->

    <!-- [ Sidebar Menu ] start -->
    <x-layouts.sidebar></x-layouts.sidebar>
    <!-- [ Sidebar Menu ] end -->

    <!-- [ Header Topbar ] start -->
    <x-layouts.header :title="$notifCount"></x-layouts.header>
    <!-- [ Header ] end -->

    <!-- [ Main Content ] start -->
    <div class="pc-container">
        <div class="pc-content">
            <!-- [ breadcrumb ] start -->
            <x-layouts.breadcrumb :title="$title"></x-layouts.breadcrumb>
            <!-- [ breadcrumb ] end -->

            <!-- [ Main Content ] start -->
            @include('partials.' . $partials)
            <!-- [ Main Content ] end -->

        </div>
    </div>

    <!-- [ Main Content ] end -->
    <x-footer></x-footer>
    @include('partials.' . $jspartials)
    @include('layouts.script')
</body>
<!-- [Body] end -->

</html>
