#! /usr/bin/env Rscript

args <- commandArgs(TRUE)
preFiles <- 1
output <- args[1]

#colors <- topo.colors(length(args) - preFiles)
colors <- gray(1:(length(args) - preFiles) / (length(args) - preFiles) * 3 / 5)
colors <- rainbow(length(args) - preFiles)
lines <- 1 #2:6 #c(2, 4, 6, 1, 3)
#lines <- c("solid", "dashed", "dotted")
totalFiles <- (preFiles + 1):length(args)
pch <- 1:(length(args) - preFiles)


frames <- Map(function(file) { 
  frame <- read.csv(file, header=TRUE)
  frame
}, args[totalFiles])

data <- Reduce(function(acc, frame) {
  result <- merge(acc, frame)
  result
}, frames)

print(colnames(data))
data <- subset(data, select=-c(1))

columns <- factor(colnames(data))

quartz("Rila")
matplot(data, type="l",
        lty=lines,
        col=colors,
        cex=1.5,
        ylim=c(0, 16000),
        lwd=2,
        xlab="messages", ylab="milliseconds")

legend("topleft",
       legend=columns,
       col=colors, lty=lines)

dev.copy(pdf,output)
dev.off()

message("Press Return To Continue")
invisible(readLines("stdin", n=1))
