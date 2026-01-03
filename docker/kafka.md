kafka-topics.sh --create --topic update_category --bootstrap-server localhost:9092
kafka-topics.sh --list --bootstrap-server localhost:9092
kafka-topics.sh --delete --topic role_listed --bootstrap-server localhost:9092

for t in \
create_category update_category delete_category \
create_product update_product delete_product stock_decrease \
create_brand update_brand delete_brand \
create_attribute update_attribute delete_attribute \
create_ships_from update_ships_from delete_ships_from \
send_otp \
create_notification read_notification delete_notification \
add_cart update_cart delete_cart \
create_order update_order cancel_order create_payment_by_order cancel_order_by_payment \
video_uploaded
do
kafka-topics.sh --create \
 --topic "$t" \
 --bootstrap-server localhost:9092 \
 --if-not-exists
done

kafka-topics.sh --create --topic video_uploaded --bootstrap-server localhost:9092
