import 'dart:ui';

import 'package:website/model/bar_graph_model.dart';
import 'package:website/model/graph_model.dart';

class BarGraphData {
  final data = [
    const BarGraphModel(
      label: "Activity Level",
      color: Color(0xFFFEB95A),
      graph: [
        GraphModel(x: 0, y: 8),
        GraphModel(x: 1, y: 10),
        GraphModel(x: 2, y: 4),
        GraphModel(x: 3, y: 2),
        GraphModel(x: 4, y: 3),
        GraphModel(x: 5, y: 1),
        GraphModel(x: 6, y: 7),
        GraphModel(x: 7, y: 8),
      ],
    ),
    const BarGraphModel(
      label: "Hydration Level",
      color: Color(0xFF20AEF3),
      graph: [
        GraphModel(x: 0, y: 8),
        GraphModel(x: 1, y: 10),
        GraphModel(x: 2, y: 4),
        GraphModel(x: 3, y: 2),
        GraphModel(x: 4, y: 3),
        GraphModel(x: 5, y: 1),
        GraphModel(x: 6, y: 7),
        GraphModel(x: 7, y: 8),
      ],
    ),
    const BarGraphModel(
      label: "Hydration Level",
      color: Color(0xFF20AEF3),
      graph: [
        GraphModel(x: 0, y: 8),
        GraphModel(x: 1, y: 10),
        GraphModel(x: 2, y: 4),
        GraphModel(x: 3, y: 2),
        GraphModel(x: 4, y: 3),
        GraphModel(x: 5, y: 1),
        GraphModel(x: 6, y: 7),
        GraphModel(x: 7, y: 8),
      ],
    ),
  ];

  final label = ["M", "T", 'W', 'T', 'F', 'S'];
}
