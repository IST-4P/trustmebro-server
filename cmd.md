kafka-topics.sh --create --topic update_category --bootstrap-server localhost:9092
kafka-topics.sh --list --bootstrap-server localhost:9092
kafka-topics.sh --delete --topic role_listed --bootstrap-server localhost:9092

for t in create_notification read_notification delete_notification; do
kafka-topics.sh --create --topic "$t" --bootstrap-server localhost:9092
done
