// ==UserScript==
// @name         Replace Dropdown Lists for Bangumi
// @namespace    https://github.com/Adachi-Git/ReplaceDropdownListsForBangumi
// @version      0.1
// @description  调整特定页面上的下拉列表选项顺序，保留原本的默认值，并按首字母排序
// @author       Adachi
// @match        *://bangumi.tv/subject/*
// @match        *://bgm.tv/subject/*
// @match        *://chii.in/subject/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数来处理下拉列表的逻辑
    function adjustSelectOptions(select) {
        // 保存原本的默认值
        var defaultValue = select.value;

        // 获取所有选项并转换为数组
        var optionsArray = Array.from(select.options);

        // 移除所有选项
        optionsArray.forEach(function(option) {
            select.remove(option.index);
        });

        // 按首字母排序选项数组
        optionsArray.sort(function(a, b) {
            return a.textContent.localeCompare(b.textContent);
        });

        // 将重新排序后的选项重新添加到下拉列表中
        optionsArray.forEach(function(option) {
            select.add(option);
        });

        // 保留原本的默认值
        select.value = defaultValue;
    }

    // 创建一个 MutationObserver 实例
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 检查是否有新的infoArr下拉列表被添加
            var newSelects = mutation.target.querySelectorAll('select[name^="infoArr"]');
            newSelects.forEach(function(newSelect) {
                // 如果是新添加的，则进行处理
                if (!newSelect.getAttribute('data-adjusted')) {
                    adjustSelectOptions(newSelect);
                    // 标记已经处理过
                    newSelect.setAttribute('data-adjusted', 'true');
                }
            });
        });
    });

    // 监听整个文档的变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
