package com.dimka.spacechat.entity;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

@Accessors(chain = true)
@Data
public class Call {

    private String id;
    private List<Long> participants;
}
