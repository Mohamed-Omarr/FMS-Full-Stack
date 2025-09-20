"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/Context/UserInfo";

function Dashboard() {
  // single user from router context
  const user = useUser();

  // array of all FMS scores for this user's patients
  const allScores: number[] = user.Patient.map((patient) => patient.FMSScore);

  const averageScore =
    allScores.reduce((sum, score) => sum + score, 0) / allScores.length;

  const averageScoreRounded = Math.round(averageScore * 10) / 10;

  // count of active patients
  const activePatientsCount = user.Patient.filter(
    (p) => p.Status.toLowerCase() === "active"
  ).length;

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Total Patients
              </h3>
              <p className="text-3xl font-bold">{user.Patient.length}</p>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Active Patients
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {activePatientsCount}
              </p>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Average FMS Score
              </h3>
              <p className="text-3xl font-bold">
                {averageScoreRounded}
                <span className="text-lg text-muted-foreground">/21</span>
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* FMS Score Distribution */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">
                FMS Score Distribution
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Excellent (18-21)</span>
                  <span className="text-sm font-medium text-green-600">
                    25%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Good (15-17)</span>
                  <span className="text-sm font-medium text-blue-600">40%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Fair (12-14)</span>
                  <span className="text-sm font-medium text-yellow-600">
                    25%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Poor (&lt;12)</span>
                  <span className="text-sm font-medium text-red-600">10%</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Motion Tracking System</span>
                  <span className="text-sm font-medium text-green-600">
                    Online
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Data Backup</span>
                  <span className="text-sm font-medium text-green-600">
                    Synced
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Camera Calibration</span>
                  <span className="text-sm font-medium text-orange-600">
                    Pending
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Security Status</span>
                  <span className="text-sm font-medium text-green-600">
                    Secure
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Performance Insights */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">
                Performance Insights
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Average Improvement</span>
                    <span className="text-sm font-medium text-green-600">
                      +12%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Assessment Completion</span>
                    <span className="text-sm font-medium text-blue-600">
                      89%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Patient Satisfaction</span>
                    <span className="text-sm font-medium text-green-600">
                      94%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-3 px-4 text-sm bg-transparent"
                >
                  New Assignment
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 px-4 text-sm bg-transparent"
                >
                  Add Patient
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 px-4 text-sm bg-transparent"
                >
                  Create Template
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 px-4 text-sm bg-transparent"
                >
                  Schedule Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
