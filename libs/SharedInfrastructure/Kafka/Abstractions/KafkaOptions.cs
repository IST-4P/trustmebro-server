namespace SharedInfrastructure.Kafka.Abstractions;

public sealed class KafkaOptions
{
  public string BootstrapServers { get; set; } = "";
  public string ClientId { get; set; } = "";
  public string GroupId { get; set; } = "";
}
