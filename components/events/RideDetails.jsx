import {
  Bike,
  Clock,
  Flag,
  Route,
  Mountain,
  ShieldCheck,
  HardHat,
  Fuel,
  Users,
  Check,
  AlertTriangle,
  Calendar,
} from 'lucide-react';

const difficultyLabel = {
  easy: 'Easy',
  moderate: 'Moderate',
  challenging: 'Challenging',
  expert: 'Expert',
};

export default function RideDetails({ ride }) {
  if (!ride) return null;
  const hasAny =
    ride.meetupTime ||
    ride.rideStartTime ||
    ride.rideTill ||
    ride.distanceKm ||
    ride.durationDays ||
    ride.difficulty ||
    ride.mandatoryDocuments?.length ||
    ride.mandatoryGears?.length ||
    ride.fuelPolicy ||
    ride.inclusions?.length ||
    ride.rideNotes;
  if (!hasAny) return null;

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-700/[0.08] text-brand-700">
          <Bike className="h-4 w-4" />
        </div>
        <h2 className="font-display text-xl font-bold text-obsidian">
          Ride details
        </h2>
      </div>

      {/* timing + route summary */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-2 gap-px bg-ink-line sm:grid-cols-4">
          {ride.meetupTime && (
            <Stat icon={Users} label="Meetup" value={ride.meetupTime} />
          )}
          {ride.rideStartTime && (
            <Stat icon={Clock} label="Ride starts" value={ride.rideStartTime} />
          )}
          {ride.distanceKm > 0 && (
            <Stat
              icon={Route}
              label="Distance"
              value={`${ride.distanceKm} km`}
            />
          )}
          {ride.durationDays > 0 && (
            <Stat
              icon={Calendar}
              label="Duration"
              value={`${ride.durationDays} day${ride.durationDays > 1 ? 's' : ''}`}
            />
          )}
          {ride.difficulty && (
            <Stat
              icon={Mountain}
              label="Difficulty"
              value={difficultyLabel[ride.difficulty] || ride.difficulty}
            />
          )}
          {typeof ride.pillionAllowed === 'boolean' && (
            <Stat
              icon={Users}
              label="Pillion"
              value={ride.pillionAllowed ? 'Allowed' : 'Solo only'}
            />
          )}
        </div>

        {ride.rideTill && (
          <div className="flex items-center gap-3 border-t border-ink-line px-5 py-4">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-sand-100 text-sand-700">
              <Flag className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-ink-muted">
                Ride till
              </p>
              <p className="font-semibold text-obsidian">{ride.rideTill}</p>
            </div>
          </div>
        )}
      </div>

      {/* mandatory docs + gear */}
      {(ride.mandatoryDocuments?.length > 0 ||
        ride.mandatoryGears?.length > 0) && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {ride.mandatoryDocuments?.length > 0 && (
            <Panel icon={ShieldCheck} title="Mandatory documents">
              <div className="flex flex-wrap gap-2">
                {ride.mandatoryDocuments.map((d) => (
                  <span
                    key={d}
                    className="chip gap-1.5 border border-brand-700/20 bg-brand-700/[0.06] text-brand-700"
                  >
                    <Check className="h-3 w-3" /> {d}
                  </span>
                ))}
              </div>
            </Panel>
          )}
          {ride.mandatoryGears?.length > 0 && (
            <Panel icon={HardHat} title="Mandatory gear">
              <div className="flex flex-wrap gap-2">
                {ride.mandatoryGears.map((g) => (
                  <span
                    key={g}
                    className="chip gap-1.5 border border-sand-200 bg-sand-50 text-sand-800"
                  >
                    <Check className="h-3 w-3" /> {g}
                  </span>
                ))}
              </div>
            </Panel>
          )}
        </div>
      )}

      {/* fuel policy */}
      {ride.fuelPolicy && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-ink-line bg-white p-4 shadow-card">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-700/[0.08] text-brand-700">
            <Fuel className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-muted">
              Fuel policy
            </p>
            <p className="text-sm font-medium text-obsidian">
              {ride.fuelPolicy}
            </p>
          </div>
        </div>
      )}

      {/* inclusions */}
      {ride.inclusions?.length > 0 && (
        <div className="mt-4">
          <Panel icon={Check} title="What's included">
            <ul className="space-y-2">
              {ride.inclusions.map((i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-obsidian"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {i}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}

      {/* ride notes */}
      {ride.rideNotes && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-amber-800">
              Important
            </p>
            <p className="mt-0.5 whitespace-pre-line text-sm leading-relaxed text-obsidian">
              {ride.rideNotes}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-white px-5 py-4">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-700/[0.08] text-brand-700">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-ink-muted">
          {label}
        </p>
        <p className="truncate font-semibold text-obsidian">{value}</p>
      </div>
    </div>
  );
}

function Panel({ icon: Icon, title, children }) {
  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-obsidian">
        <Icon className="h-4 w-4 text-brand-700" />
        {title}
      </div>
      {children}
    </div>
  );
}
