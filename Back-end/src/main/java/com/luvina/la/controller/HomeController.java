/**
 * Copyright(C) 2026 Luvina Software Company
 * HomeController.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

/**
 * Controller kiểm tra trạng thái sức khỏe khởi điểm của dịch vụ back-end.
 * 
 * @author Nguyen Huy Hoang
 */
@RestController
public class HomeController {

    private final MessageSource messageSource;

    public HomeController(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /** Đích khởi động ngẫu nhiên xác nhận dịch vụ đã lên */
    @RequestMapping("/")
    public String index() {
        return messageSource.getMessage("msg.home.welcome", null, LocaleContextHolder.getLocale());
    }

}
