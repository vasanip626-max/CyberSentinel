from database import attack_collection
from datetime import datetime, timedelta

def save_attack(data):
    if isinstance(data, dict):
        now_time = datetime.now()
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
        time_str = "Just Now"
        if isinstance(ts, datetime):
            time_str = ts.strftime("%I:%M:%S %p")
        elif isinstance(ts, str) and ts:
            if "T" in ts:
                parts = ts.split("T")
                time_str = parts[-1][:8]
            else:
                time_str = ts

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
            "timestamp": str(ts),
            "description": a.get("description") or f"{attack_name} attempt detected",
            "target_user": a.get("target_user") or "",
            "actor_user": a.get("actor_user") or ""
        })
    return formatted