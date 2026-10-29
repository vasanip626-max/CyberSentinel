from database import attack_collection
from datetime import datetime, timedelta, timezone

# Indian Standard Time (IST = UTC + 5:30)
IST = timezone(timedelta(hours=5, minutes=30))

def to_ist_time_str(ts):
    if not ts:
        return "Just Now"

    dt = None
    if isinstance(ts, datetime):
        if ts.tzinfo is None:
            # Naive datetime from Render/MongoDB is UTC
            dt = ts.replace(tzinfo=timezone.utc).astimezone(IST)
        else:
            dt = ts.astimezone(IST)
    elif isinstance(ts, str):
        try:
            clean = ts.replace("Z", "+00:00")
            parsed = datetime.fromisoformat(clean)
            if parsed.tzinfo is None:
                dt = parsed.replace(tzinfo=timezone.utc).astimezone(IST)
            else:
                dt = parsed.astimezone(IST)
        except Exception:
            return ts

    if dt:
        return dt.strftime("%I:%M:%S %p")
    return str(ts)


def save_attack(data):
    if isinstance(data, dict):
        now_time = datetime.now(timezone.utc)
        if "timestamp" not in data or not data["timestamp"]:
            data["timestamp"] = now_time

        # Deduplication check: ignore duplicate attack from same actor/target within last 2 seconds
        actor = data.get("actor_user") or ""
        target = data.get("target_user") or ""
        attack_type = data.get("attack_type") or data.get("attack") or ""

        if actor or target:
            two_secs_ago = now_time - timedelta(seconds=2)
            recent_duplicate = attack_collection.find_one({
                "attack_type": attack_type,
                "actor_user": actor,
                "target_user": target,
                "timestamp": {"$gte": two_secs_ago}
            })
            if recent_duplicate:
                print(f"[DEDUPLICATED] Skipped duplicate attack insert for '{actor}' -> '{target}'")
                return recent_duplicate.get("_id")

    return attack_collection.insert_one(data)


def get_all_attacks():
    raw_attacks = list(attack_collection.find({}, {"_id": 0}).sort("timestamp", -1))
    formatted = []
    for a in raw_attacks:
        ts = a.get("timestamp") or a.get("time") or ""
        time_str = to_ist_time_str(ts)

        # Standardize ISO string with timezone info for frontend consumers
        iso_timestamp = ""
        if isinstance(ts, datetime):
            if ts.tzinfo is None:
                iso_timestamp = ts.replace(tzinfo=timezone.utc).isoformat()
            else:
                iso_timestamp = ts.isoformat()
        else:
            iso_timestamp = str(ts)

        attack_name = a.get("attack") or a.get("attack_type") or "Security Incident"
        ip_addr = a.get("ip") or a.get("ip_address") or "127.0.0.1"
        sev = a.get("severity") or "High"
        stat = a.get("status") or "Detected"

        formatted.append({
            "attack": attack_name,
            "attack_type": attack_name,
            "ip": ip_addr,
            "ip_address": ip_addr,
            "severity": sev,
            "status": stat,
            "time": time_str,
            "timestamp": iso_timestamp,
            "description": a.get("description") or f"{attack_name} attempt detected",
            "target_user": a.get("target_user") or "",
            "actor_user": a.get("actor_user") or ""
        })
    return formatted
