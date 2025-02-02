import 'package:flutter/material.dart';
import 'package:website/widgets/activity_details_card.dart';
import 'package:website/widgets/bar_graph_widget.dart';
import 'package:website/widgets/header_widget.dart';
import 'package:website/widgets/line_chart_card.dart';

class DashboardWidget extends StatelessWidget {
  const DashboardWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          const SizedBox(height: 18),
          const HeaderWidget(),
          const SizedBox(height: 18),
          Expanded(
            child:
                ActivityDetailsCard(), // Gunakan Expanded agar tidak terdesak ke bawah
          ),
          const SizedBox(height: 18),
          const LineChartCard(),
          const SizedBox(height: 18),
          const BarGraphCard(),
        ],
      ),
    );
  }
}
