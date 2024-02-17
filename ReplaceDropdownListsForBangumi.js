// ==UserScript==
// @name         Replace Dropdown Lists for Bangumi
// @namespace    https://github.com/Adachi-Git/ReplaceDropdownListsForBangumi
// @version      0.5
// @description  调整页面上的下拉列表选项顺序，保留原本的默认值，并按首字母排序，并且使用懒加载功能
// @author       Adachi
// @match        *://bangumi.tv/subject/*
// @match        *://bgm.tv/subject/*
// @match        *://chii.in/subject/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var delay = 2000; // 设置延迟执行时间，单位是毫秒

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

    // 延迟执行处理函数
    setTimeout(function() {
        // 查找可见的下拉列表并处理它们
        var selects = document.querySelectorAll('select[name^="infoArr"]:not([data-adjusted])');
        selects.forEach(function(select) {
            if (isElementInViewport(select)) {
                adjustSelectOptions(select);
                select.setAttribute('data-adjusted', 'true');
            }
        });
    }, delay);

    // 添加 DOM 变化的监听器
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 查找新增的下拉列表并处理
            var newSelects = mutation.target.querySelectorAll('select[name^="infoArr"]:not([data-adjusted])');
            newSelects.forEach(function(newSelect) {
                if (isElementInViewport(newSelect)) {
                    adjustSelectOptions(newSelect);
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

    // 添加滚动事件监听器
    window.addEventListener('scroll', function() {
        // 查找尚未处理的下拉列表
        var selects = document.querySelectorAll('select[name^="infoArr"]:not([data-adjusted])');
        selects.forEach(function(select) {
            // 如果该下拉列表在视图内，进行处理并标记为已处理
            if (isElementInViewport(select)) {
                adjustSelectOptions(select);
                select.setAttribute('data-adjusted', 'true');
            }
        });
    });

    // 检查元素是否在视图内
    function isElementInViewport(element) {
        var rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
})();
