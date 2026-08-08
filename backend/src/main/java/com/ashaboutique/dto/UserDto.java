package com.ashaboutique.dto;

import com.ashaboutique.model.Role;

public record UserDto(Long id, String name, String email, String phone, Role role, Boolean blocked) {}
