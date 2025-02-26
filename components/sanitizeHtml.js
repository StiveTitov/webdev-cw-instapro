
export const sanitizeHtml = (htmlString) => {
    return htmlString.replaceAll("&", "&amp;")// обязательно начинать обработку с "&", "&amp;"! иначе  при символе "<" будет выводиться "&lt;" и т.д.
        .replaceAll("<", "&lt;")// элементарная обработка пользовательского ввода на предмет
        .replaceAll(">", "&gt;") // всяких нехороших вещей в HTML-коде, в данном случае управляющие символы разметки "<" и ">"
        .replaceAll('"', "&quot;");// меняются; на их коды, а браузер всёравно выводит эти символы
};