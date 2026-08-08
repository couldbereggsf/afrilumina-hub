package com.reggs.afrilumina.payment.dto;

import lombok.Data;

@Data
public class StkPushResponse {
    private String MerchantRequestID;
    private String CheckoutRequestID;
    private String ResponseCode;
    private String ResponseDescription;
    private String CustomerMessage;
    
}
