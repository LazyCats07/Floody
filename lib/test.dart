// import 'package:flutter/rendering.dart';

// import 'package:flutter/gestures.dart';

void main() {
  // print('\n');
  print('hello world');
  print('\n');
  print('\n');

  test();

  var value = getValue();
  print('Variable sudah dibuat');
  print(value);
}

String getValue() {
  print('\n');
  print('getValue() dipanggil');
  return 'Muhammad Rafi Ediannanta';
}

void test() {
  String name = "rafi";
  print(name);
  print("\n");

  var two = 1;
  print(two);

  var firstName = "ren";
  final lastName = 'test';

  firstName = "lol";
  // var lastName = "rehan";

  print(firstName);
  print(lastName);

  // final array1 = [1, 2, 3];
  // const array2 = [1, 2, 3];

  // kalau final, variabel nya tidak boleh di deklarasikan ulang, namun value nya dapat di diubah
  // kalau const, variabelnya tidak boleh di deklarasikan ulang, bergitu pula value nya

  // array1[0] = 5;
  // array2[0] = 5;

  // print(array1);
  // print(array2);

  // const tes = 3;
}
