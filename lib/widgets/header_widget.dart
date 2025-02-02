import 'package:flutter/material.dart';
import 'package:website/const/constant.dart';

class HeaderWidget extends StatelessWidget {
  const HeaderWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity, // Menggunakan lebar penuh
      
      child: TextField(
        decoration: InputDecoration(
          filled: true,
          fillColor: cardBackgroundColor,
          enabledBorder: const OutlineInputBorder(
            borderSide: BorderSide(color: Colors.transparent),
          ),

          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0)),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12.0),
            borderSide: BorderSide(color: Theme.of(context).primaryColor),
          ),
          
          contentPadding: const EdgeInsets.symmetric(
            vertical: 10, // Tinggi lebih nyaman
            horizontal: 10,
          ),

          hintText: 'Search',
          prefixIcon: const Icon(Icons.search, color: Colors.grey, size: 21),
        ),
      ),
    );
  }
}
