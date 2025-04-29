package com.example.vistara.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {

        List<User> users = userRepository.findAll();
        users.forEach(user -> user.setName(user.getDisplayUsername()));

        return users;
    }

    public boolean deleteUser(Long id) {
        userRepository.deleteById(id);
        return true;
    }

    public Optional<User> getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        user.ifPresent(value -> value.setName(value.getDisplayUsername()));
        return userRepository.findById(id);
    }

    public User updateUser(Long id, User userUpdates) {
        Optional<User> user = userRepository.findById(id);

        if (user.isEmpty()) {
            throw new RuntimeException("User not found with id: " + id);
        }

        User existingUser = user.get();

        // Update only non-null fields from the incoming user object
        if (userUpdates.getDisplayUsername() != null) {
            existingUser.setName(userUpdates.getDisplayUsername());
        }
        if (userUpdates.getEmail() != null) {
            existingUser.setEmail(userUpdates.getEmail());
        }
        if (userUpdates.getPhone() != null) {
            existingUser.setPhone(userUpdates.getPhone());
        }
        if (userUpdates.getPassword() != null) {
            existingUser.setPassword(userUpdates.getPassword());
        }

        return userRepository.save(existingUser);
    }
}
