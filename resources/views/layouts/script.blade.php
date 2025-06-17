    <script>
        const menuItems = @json($menuItems);
        const menuList = document.getElementById('menu-list')
        menuItems.forEach(item => {
            const li = document.createElement('li');
            li.className = 'pc-item';

            const a = document.createElement('a');
            a.className = 'pc-link';
            a.href = item.href;

            const iconSpan = document.createElement('span');
            iconSpan.className = 'pc-micon';
            iconSpan.innerHTML = `<i data-feather="${item.i}"></i>`;

            const textSpan = document.createElement('span');
            textSpan.className = 'pc-mtext';
            textSpan.textContent = item.text;

            a.appendChild(iconSpan);
            a.appendChild(textSpan);
            li.appendChild(a);
            menuList.appendChild(li);
        });
    </script>

    <div class="floting-button fixed bottom-[50px] right-[30px] z-[1030]">
    </div>
