import 'package:website/model/health_model.dart';

class HealthDetails {
  final healthData = const [
    HealthModel(
      icon: 'assets/icons/burn.png',
      value: "305",
      title: "Calories Burned",
    ),
    HealthModel(
      icon: 'assets/icons/steps.png',
      value: "10,983",
      title: "Steps",
    ),
    HealthModel(
      icon: 'assets/icons/distance.png',
      value: "7 Km",
      title: "Distance",
    ),
    HealthModel(icon: "assets/icons/sleep.png", value: "7H48m", title: "Sleep"),
  ];
}
